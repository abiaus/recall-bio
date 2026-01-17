import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { LegacyPageContent } from "@/components/legacy/LegacyPageContent";

export default async function LegacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("legacy");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  const { data: ownedLegacy } = await supabase
    .schema("public")
    .from("legacy_access")
    .select("*")
    .eq("owner_user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: heirLegacy } = await supabase
    .schema("public")
    .from("legacy_access")
    .select("*")
    .eq("heir_user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <LegacyPageContent
      title={t("title")}
      subtitle={t("subtitle")}
      ownedLegacy={ownedLegacy || []}
      heirLegacy={heirLegacy || []}
    />
  );
}
