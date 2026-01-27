"use server";

import { createClient } from "@/lib/supabase/server";
import {
  stableDailySeed,
  pickWeighted,
  questionLifeStageMatch,
} from "@/lib/prompts/dailyPrompt";
import type { LifeStage } from "@/lib/prompts/dailyPrompt";

export type DailyPromptResult =
  | { status: "assigned"; question_id: string; text: string }
  | { status: "no_questions" }
  | { status: "error" };

export async function getOrAssignDailyPrompt(
  userId: string,
  date?: Date,
  locale: string = "en"
): Promise<DailyPromptResult> {
  const supabase = await createClient();
  const resolvedDate = date ?? new Date();
  const isoDate = resolvedDate.toISOString().split("T")[0];
  const useSpanish = locale === "es";

  // Helper to get the correct text based on locale
  const getQuestionText = (q: { text: string; text_es?: string | null }) => {
    if (useSpanish && q.text_es) {
      return q.text_es;
    }
    return q.text;
  };

  // Check if already assigned - get the latest prompt (highest prompt_index)
  const { data: existingPrompts, error: existingPromptsError } = await supabase
    .schema("public")
    .from("daily_prompts")
    .select("question_id, prompt_index, questions!inner(text, text_es)")
    .eq("user_id", userId)
    .eq("prompt_date", isoDate)
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
      const questionText = getQuestionText(questionData);
      if (questionText) {
        return {
          status: "assigned",
          question_id: existingPrompts.question_id,
          text: questionText,
        };
      }
    }
  }

  // Get user profile for life_stage (profile may not exist yet)
  const { data: profile } = await supabase
    .schema("public")
    .from("profiles")
    .select("life_stage")
    .eq("id", userId)
    .maybeSingle();

  // Default to "adult" if no profile exists
  const lifeStage = (profile?.life_stage as LifeStage) || "adult";

  // Fetch available questions (include text_es for Spanish locale)
  const { data: questions, error: questionsError } = await supabase
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

  // Weight questions by life_stage match and variety
  // life_stage en BD: string, string[] (ej. ["young_adult","adult","midlife"]) o null
  const weighted = questions.map((q) => {
    let weight = 1;
    const match = questionLifeStageMatch(q.life_stage, lifeStage);
    if (match === "match") weight *= 2;
    else if (match === "generic") weight *= 1.5;
    return { item: q, weight };
  });

  const seed = stableDailySeed(userId, isoDate);
  const selected = pickWeighted(weighted, seed);

  // Persist assignment with prompt_index = 1 (first prompt of the day)
  const { error } = await supabase
    .schema("public")
    .from("daily_prompts")
    .insert({
      user_id: userId,
      prompt_date: isoDate,
      question_id: selected.id,
      prompt_index: 1,
      mode: "hybrid",
    });

  if (error) {
    // Handle race condition: if another request already inserted, fetch the existing record
    if (error.code === "23505") {
      const { data: racePrompt } = await supabase
        .schema("public")
        .from("daily_prompts")
        .select("question_id, prompt_index, questions!inner(text, text_es)")
        .eq("user_id", userId)
        .eq("prompt_date", isoDate)
        .order("prompt_index", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (racePrompt?.question_id) {
        const questionData = Array.isArray(racePrompt.questions)
          ? racePrompt.questions[0]
          : (racePrompt.questions as { text: string; text_es?: string | null });
        if (questionData) {
          const questionText = getQuestionText(questionData);
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
    console.error("Error details:", JSON.stringify(error, null, 2));
    return { status: "error" };
  }

  const questionText = getQuestionText(selected);

  return {
    status: "assigned",
    question_id: selected.id,
    text: questionText,
  };
}

export async function assignNextDailyPrompt(
  userId: string,
  date?: Date,
  locale: string = "en"
): Promise<DailyPromptResult> {
  const supabase = await createClient();
  const resolvedDate = date ?? new Date();
  const isoDate = resolvedDate.toISOString().split("T")[0];
  const useSpanish = locale === "es";

  // Helper to get the correct text based on locale
  const getQuestionText = (q: { text: string; text_es?: string | null }) => {
    if (useSpanish && q.text_es) {
      return q.text_es;
    }
    return q.text;
  };

  // Get all question_ids already assigned to this user on this date
  const { data: existingPrompts, error: existingPromptsError } = await supabase
    .schema("public")
    .from("daily_prompts")
    .select("question_id, prompt_index")
    .eq("user_id", userId)
    .eq("prompt_date", isoDate)
    .order("prompt_index", { ascending: false });

  if (existingPromptsError) {
    console.error("Error fetching existing prompts:", existingPromptsError);
    return { status: "error" };
  }

  const usedQuestionIds = new Set(
    existingPrompts?.map((p) => p.question_id) || []
  );

  // Find the highest prompt_index to calculate the next one
  const maxIndex =
    existingPrompts && existingPrompts.length > 0
      ? Math.max(...existingPrompts.map((p) => p.prompt_index || 1))
      : 0;
  const nextIndex = maxIndex + 1;

  // Get user profile for life_stage (profile may not exist yet)
  const { data: profile } = await supabase
    .schema("public")
    .from("profiles")
    .select("life_stage")
    .eq("id", userId)
    .maybeSingle();

  // Default to "adult" if no profile exists
  const lifeStage = (profile?.life_stage as LifeStage) || "adult";

  // Fetch available questions (exclude already used ones for this day)
  const { data: questions, error: questionsError } = await supabase
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

  // Filter out questions already used today
  const availableQuestions = questions.filter(
    (q) => !usedQuestionIds.has(q.id)
  );

  // If all questions have been used today, allow repeats but log it
  const questionsToUse =
    availableQuestions.length > 0 ? availableQuestions : questions;

  if (availableQuestions.length === 0) {
    console.log(
      `All questions have been used today for user ${userId}. Allowing repeat.`
    );
  }

  // Weight questions by life_stage match and variety
  // life_stage en BD: string, string[] (ej. ["young_adult","adult","midlife"]) o null
  const weighted = questionsToUse.map((q) => {
    let weight = 1;
    const match = questionLifeStageMatch(q.life_stage, lifeStage);
    if (match === "match") weight *= 2;
    else if (match === "generic") weight *= 1.5;
    return { item: q, weight };
  });

  // Use a seed based on userId, date, and nextIndex for variety
  const seedString = `${userId}:${isoDate}:${nextIndex}`;
  let seed = 0;
  for (let i = 0; i < seedString.length; i++) {
    seed = (seed * 31 + seedString.charCodeAt(i)) >>> 0;
  }
  const selected = pickWeighted(weighted, seed);

  // Persist assignment with next prompt_index
  const { error } = await supabase
    .schema("public")
    .from("daily_prompts")
    .insert({
      user_id: userId,
      prompt_date: isoDate,
      question_id: selected.id,
      prompt_index: nextIndex,
      mode: "hybrid",
    });

  if (error) {
    console.error("Error assigning next daily prompt:", error);
    return { status: "error" };
  }

  const questionText = getQuestionText(selected);

  return {
    status: "assigned",
    question_id: selected.id,
    text: questionText,
  };
}
