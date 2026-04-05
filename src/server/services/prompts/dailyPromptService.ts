import { SupabaseClient } from "@supabase/supabase-js";
import { stableDailySeed, pickWeighted, questionLifeStageMatch } from "@/lib/prompts/dailyPrompt";
import type { LifeStage } from "@/lib/prompts/dailyPrompt";
import { getLocalDateString } from "@/utils/dateUtils";

export type DailyPromptResult =
  | { status: "assigned"; question_id: string; text: string }
  | { status: "no_questions" }
  | { status: "error" };

export class DailyPromptService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Helper internal to get the question text depending on locale
   */
  private getQuestionText(q: { text: string; text_es?: string | null }, locale: string): string {
    const useSpanish = locale === "es";
    if (useSpanish && q.text_es) {
      return q.text_es;
    }
    return q.text;
  }

  /**
   * Retrieves an already assigned daily prompt or assigns a new one using user's explicit local date.
   */
  async getOrAssignPrompt(
    userId: string,
    localDate: string,
    locale: string = "en"
  ): Promise<DailyPromptResult> {
    
    // 1. Check if already assigned for this specific local date date (index 1)
    const { data: existingPrompts, error: existingPromptsError } = await this.supabase
      .schema("public")
      .from("daily_prompts")
      .select("question_id, prompt_index, questions!inner(text, text_es)")
      .eq("user_id", userId)
      .eq("prompt_date", localDate)
      .order("prompt_index", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingPromptsError) {
      console.error("Error fetching existing prompts:", existingPromptsError);
      return { status: "error" };
    }

    if (existingPrompts && existingPrompts.question_id) {
      const questionData = Array.isArray(existingPrompts.questions)
        ? existingPrompts.questions[0]
        : (existingPrompts.questions as { text: string; text_es?: string | null });
      if (questionData) {
        const questionText = this.getQuestionText(questionData, locale);
        if (questionText) {
          return {
            status: "assigned",
            question_id: existingPrompts.question_id,
            text: questionText,
          };
        }
      }
    }

    // 2. We need profile timezone and life_stage to assign
    const { data: profile } = await this.supabase
      .schema("public")
      .from("profiles")
      .select("life_stage")
      .eq("id", userId)
      .maybeSingle();

    const lifeStage = (profile?.life_stage as LifeStage) || "adult";

    // 3. Fetch active questions
    const { data: questions, error: questionsError } = await this.supabase
      .schema("public")
      .from("questions")
      .select("id, text, text_es, life_stage, tags")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (questionsError) {
      console.error("Error fetching questions:", questionsError);
      return { status: "error" };
    }

    if (!questions || questions.length === 0) {
      return { status: "no_questions" };
    }

    // 4. Weight matching
    const weighted = questions.map((q) => {
      let weight = 1;
      const match = questionLifeStageMatch(q.life_stage, lifeStage);
      if (match === "match") weight *= 2;
      else if (match === "generic") weight *= 1.5;
      return { item: q, weight };
    });

    const seed = stableDailySeed(userId, localDate);
    const selected = pickWeighted(weighted, seed);

    // 5. Persist assignment
    const { error } = await this.supabase
      .schema("public")
      .from("daily_prompts")
      .insert({
        user_id: userId,
        prompt_date: localDate,
        question_id: selected.id,
        prompt_index: 1,
        mode: "hybrid",
      });

    if (error) {
      // Race condition safety as in the action
      if (error.code === "23505") {
        const { data: racePrompt } = await this.supabase
          .schema("public")
          .from("daily_prompts")
          .select("prompt_index, question_id, questions!inner(text, text_es)")
          .eq("user_id", userId)
          .eq("prompt_date", localDate)
          .eq("prompt_index", 1)
          .limit(1)
          .maybeSingle();

        if (racePrompt?.question_id) {
          const questionData = Array.isArray(racePrompt.questions)
            ? racePrompt.questions[0]
            : (racePrompt.questions as { text: string; text_es?: string | null });
          if (questionData) {
            const questionText = this.getQuestionText(questionData, locale);
            if (questionText) {
              return {
                status: "assigned",
                question_id: racePrompt.question_id,
                text: questionText,
              };
            }
          }
        }
      }
      console.error("Error assigning daily prompt:", error);
      return { status: "error" };
    }

    return {
      status: "assigned",
      question_id: selected.id,
      text: this.getQuestionText(selected, locale),
    };
  }

  /**
   * Assings a New prompt for the same date (user skipped the previous one)
   */
  async assignNextPrompt(
    userId: string,
    localDate: string,
    locale: string = "en"
  ): Promise<DailyPromptResult> {
    
    // Get already assigned for this day to exclude and calculate next index
    const { data: existingPrompts, error: existingPromptsError } = await this.supabase
      .schema("public")
      .from("daily_prompts")
      .select("question_id, prompt_index")
      .eq("user_id", userId)
      .eq("prompt_date", localDate)
      .order("prompt_index", { ascending: false });

    if (existingPromptsError) {
      return { status: "error" };
    }

    const usedQuestionIds = new Set(existingPrompts?.map((p) => p.question_id) || []);
    const maxIndex = existingPrompts && existingPrompts.length > 0
        ? Math.max(...existingPrompts.map((p) => p.prompt_index || 1))
        : 0;
    const nextIndex = maxIndex + 1;

    const { data: profile } = await this.supabase
      .schema("public")
      .from("profiles")
      .select("life_stage")
      .eq("id", userId)
      .maybeSingle();

    const lifeStage = (profile?.life_stage as LifeStage) || "adult";

    const { data: questions, error: questionsError } = await this.supabase
      .schema("public")
      .from("questions")
      .select("id, text, text_es, life_stage, tags")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (questionsError || !questions || questions.length === 0) {
      return { status: "no_questions" };
    }

    const availableQuestions = questions.filter((q) => !usedQuestionIds.has(q.id));
    const questionsToUse = availableQuestions.length > 0 ? availableQuestions : questions;

    const weighted = questionsToUse.map((q) => {
      let weight = 1;
      const match = questionLifeStageMatch(q.life_stage, lifeStage);
      if (match === "match") weight *= 2;
      else if (match === "generic") weight *= 1.5;
      return { item: q, weight };
    });

    const seedString = `${userId}:${localDate}:${nextIndex}`;
    let seed = 0;
    for (let i = 0; i < seedString.length; i++) {
      seed = (seed * 31 + seedString.charCodeAt(i)) >>> 0;
    }
    
    const selected = pickWeighted(weighted, seed);

    const { error } = await this.supabase
      .schema("public")
      .from("daily_prompts")
      .insert({
        user_id: userId,
        prompt_date: localDate,
        question_id: selected.id,
        prompt_index: nextIndex,
        mode: "hybrid",
      });

    if (error) {
      console.error("Error assigning next daily prompt:", error);
      return { status: "error" };
    }

    return {
      status: "assigned",
      question_id: selected.id,
      text: this.getQuestionText(selected, locale),
    };
  }
}
