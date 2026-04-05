import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { localePath } from "@/i18n/routing";
import { HeirMemoriesView } from "@/components/legacy/HeirMemoriesView";

export default async function LegacyViewPage({
  params,
}: {
  params: Promise<{ locale: string; legacyId: string }>;
}) {
  const { locale, legacyId } = await params;
  const t = await getTranslations("legacy");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(localePath("/auth/login", locale));
  }

  // Verify access and get owner details
  const { data: legacyAccess, error: accessError } = await supabase
    .schema("public")
    .from("legacy_access")
    .select("owner_user_id, status, profiles!owner_user_id(display_name)")
    .eq("id", legacyId)
    .eq("heir_user_id", user.id)
    .eq("status", "active")
    .single();

  if (accessError || !legacyAccess) {
    redirect(localePath("/app/legacy", locale));
  }

  // Fetch memories of the owner
  const { data: memories } = await supabase
    .schema("public")
    .from("memories")
    .select(
      "id, title, content_text, mood, prompt_date, created_at, questions!inner(text, text_es), memory_media(id, kind, storage_path, duration_ms, transcript)"
    )
    .eq("user_id", legacyAccess.owner_user_id)
    .order("prompt_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  // Get owner's display name or fallback
  const ownerProfile = legacyAccess.profiles as unknown as { display_name: string | null } | null;
  const ownerName = ownerProfile?.display_name || "Owner";

  return (
    <HeirMemoriesView
      ownerName={ownerName}
      memories={memories || []}
    />
  );
}
