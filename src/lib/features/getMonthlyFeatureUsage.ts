import type { SupabaseClient } from "@supabase/supabase-js";

export async function getMonthlyFeatureUsage(
  supabase: SupabaseClient,
  userId: string,
  featureKey: string
): Promise<number> {
  if (featureKey !== "transcription") {
    return 0;
  }

  const startOfMonth = new Date();
  startOfMonth.setUTCDate(1);
  startOfMonth.setUTCHours(0, 0, 0, 0);

  const { count } = await supabase
    .schema("public")
    .from("memory_media")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("kind", "audio")
    .in("transcript_status", ["pending", "processing", "completed", "failed"])
    .gte("created_at", startOfMonth.toISOString());

  return count || 0;
}
