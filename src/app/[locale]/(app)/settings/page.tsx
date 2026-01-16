import { getTranslations } from "next-intl/server";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const t = await getTranslations("nav");

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-semibold text-[#2B241B]">
        {t("settings")}
      </h1>
      <p className="text-[#5A4A3A]">
        Adjust your profile and preferences...
      </p>
    </div>
  );
}
