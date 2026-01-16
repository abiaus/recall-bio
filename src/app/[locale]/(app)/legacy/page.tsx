import { createClient } from "@/lib/supabase/server";
import { LegacyManager } from "@/components/legacy/LegacyManager";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

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
    .schema("recallbio")
    .from("legacy_access")
    .select("*")
    .eq("owner_user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: heirLegacy } = await supabase
    .schema("recallbio")
    .from("legacy_access")
    .select("*")
    .eq("heir_user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-semibold text-[#2B241B]">
        {t("title")}
      </h1>
      <p className="text-[#5A4A3A]">{t("subtitle")}</p>

      <LegacyManager
        ownedLegacy={ownedLegacy || []}
        heirLegacy={heirLegacy || []}
      />
    </div>
  );
}
