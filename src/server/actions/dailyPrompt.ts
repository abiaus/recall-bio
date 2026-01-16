"use server";

import { createClient } from "@/lib/supabase/server";
import { stableDailySeed, pickWeighted } from "@/lib/prompts/dailyPrompt";
import type { LifeStage } from "@/lib/prompts/dailyPrompt";

export async function getOrAssignDailyPrompt(
  userId: string,
  date: Date = new Date()
): Promise<{ question_id: string; text: string } | null> {
  const supabase = await createClient();
  const isoDate = date.toISOString().split("T")[0];

  // Check if already assigned
  const { data: existing } = await supabase
    .schema("recallbio")
    .from("daily_prompts")
    .select("question_id, questions!inner(text)")
    .eq("user_id", userId)
    .eq("prompt_date", isoDate)
    .maybeSingle();

  if (existing && existing.question_id) {
    const questionText = Array.isArray(existing.questions)
      ? existing.questions[0]?.text
      : (existing.questions as { text: string })?.text;
    if (questionText) {
      return {
        question_id: existing.question_id,
        text: questionText,
      };
    }
  }

  // Get user profile for life_stage
  const { data: profile } = await supabase
    .schema("recallbio")
    .from("profiles")
    .select("life_stage")
    .eq("id", userId)
    .single();

  const lifeStage = (profile?.life_stage as LifeStage) || "adult";

  // Fetch available questions
  const { data: questions } = await supabase
    .schema("recallbio")
    .from("questions")
    .select("id, text, life_stage, tags")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (!questions || questions.length === 0) {
    return null;
  }

  // Weight questions by life_stage match and variety
  const weighted = questions.map((q) => {
    let weight = 1;
    if (q.life_stage === lifeStage) weight *= 2;
    if (!q.life_stage) weight *= 1.5; // Generic questions get medium priority
    return { item: q, weight };
  });

  const seed = stableDailySeed(userId, isoDate);
  const selected = pickWeighted(weighted, seed);

  // Persist assignment
  const { error } = await supabase
    .schema("recallbio")
    .from("daily_prompts")
    .insert({
      user_id: userId,
      prompt_date: isoDate,
      question_id: selected.id,
      mode: "hybrid",
    });

  if (error) {
    console.error("Error assigning daily prompt:", error);
    return null;
  }

  return {
    question_id: selected.id,
    text: selected.text,
  };
}
