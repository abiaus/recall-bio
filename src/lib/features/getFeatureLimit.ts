import type { SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_PLAN = "free";

async function getUserPlan(
  supabase: SupabaseClient,
  userId: string
): Promise<string> {
  const { data } = await supabase
    .schema("public")
    .from("profiles")
    .select("plan")
    .eq("id", userId)
    .maybeSingle();

  return data?.plan || DEFAULT_PLAN;
}

export async function getFeatureLimit(
  supabase: SupabaseClient,
  userId: string,
  featureKey: string
): Promise<number | null> {
  const plan = await getUserPlan(supabase, userId);

  const { data: override } = await supabase
    .schema("public")
    .from("user_feature_overrides")
    .select("limit_value")
    .eq("user_id", userId)
    .eq("feature_key", featureKey)
    .maybeSingle();

  if (typeof override?.limit_value === "number") {
    return override.limit_value;
  }

  const { data: feature } = await supabase
    .schema("public")
    .from("plan_features")
    .select("limit_value")
    .eq("plan", plan)
    .eq("feature_key", featureKey)
    .maybeSingle();

  return typeof feature?.limit_value === "number" ? feature.limit_value : null;
}
