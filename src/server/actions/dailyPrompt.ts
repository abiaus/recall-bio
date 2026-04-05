"use server";

import { createClient } from "@/lib/supabase/server";
import type { DailyPromptResult } from "@/server/services/prompts/dailyPromptService";
import { DailyPromptService } from "@/server/services/prompts/dailyPromptService";


export async function getOrAssignDailyPrompt(
  userId: string,
  date?: Date,
  locale: string = "en"
): Promise<DailyPromptResult> {
  const supabase = await createClient();
  const service = new DailyPromptService(supabase);
  
  const resolvedDate = date ?? new Date();
  const isoDate = resolvedDate.toISOString().split("T")[0];

  return service.getOrAssignPrompt(userId, isoDate, locale);
}

export async function assignNextDailyPrompt(
  userId: string,
  date?: Date,
  locale: string = "en"
): Promise<DailyPromptResult> {
  const supabase = await createClient();
  const service = new DailyPromptService(supabase);

  const resolvedDate = date ?? new Date();
  const isoDate = resolvedDate.toISOString().split("T")[0];

  return service.assignNextPrompt(userId, isoDate, locale);
}
