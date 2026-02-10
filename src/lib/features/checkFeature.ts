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

export async function checkFeature(
  supabase: SupabaseClient,
  userId: string,
  featureKey: string
): Promise<boolean> {
  const plan = await getUserPlan(supabase, userId);

  const { data: override } = await supabase
    .schema("public")
    .from("user_feature_overrides")
    .select("enabled")
    .eq("user_id", userId)
    .eq("feature_key", featureKey)
    .maybeSingle();

  if (typeof override?.enabled === "boolean") {
    return override.enabled;
  }

  const { data: feature } = await supabase
    .schema("public")
    .from("plan_features")
    .select("enabled")
    .eq("plan", plan)
    .eq("feature_key", featureKey)
    .maybeSingle();

  return Boolean(feature?.enabled);
}
