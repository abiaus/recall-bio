import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { localePath } from "@/i18n/routing";
import { HeirMemoryDetail } from "@/components/legacy/HeirMemoryDetail";

export default async function LegacyMemoryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; legacyId: string; memoryId: string }>;
}) {
  const { locale, legacyId, memoryId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(localePath("/auth/login", locale));
  }

  // 1. Verify legacy access and get owner_user_id
  const { data: legacyAccess, error: accessError } = await supabase
    .schema("public")
    .from("legacy_access")
    .select("owner_user_id, status")
    .eq("id", legacyId)
    .eq("heir_user_id", user.id)
    .eq("status", "active")
    .single();

  if (accessError || !legacyAccess) {
    redirect(localePath("/app/legacy", locale));
  }

  // 2. Fetch the specific memory of the owner
  const { data: memory } = await supabase
    .schema("public")
    .from("memories")
    .select(
      "id, title, content_text, mood, prompt_date, created_at, questions!inner(text, text_es)"
    )
    .eq("id", memoryId)
    .eq("user_id", legacyAccess.owner_user_id)
    .maybeSingle();

  if (!memory) {
    notFound();
  }

  return (
    <HeirMemoryDetail 
        memory={memory as any} 
        legacyId={legacyId} 
    />
  );
}
