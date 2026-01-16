"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function OnboardingPage() {
  const t = useTranslations("onboarding");
  const [lifeStage, setLifeStage] = useState<string>("");
  const [timezone, setTimezone] = useState<string>(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push(`/${locale}/auth/login`);
      return;
    }

    const { error } = await supabase
      .schema("recallbio")
      .from("profiles")
      .upsert({
        id: user.id,
        display_name: user.user_metadata?.display_name || "",
        life_stage: lifeStage,
        timezone,
      })
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      setLoading(false);
    } else {
      router.push(`/${locale}/app/today`);
      router.refresh();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="font-serif text-3xl font-semibold text-[#2B241B]">
        {t("title")}
      </h1>
      <p className="text-[#5A4A3A]">{t("subtitle")}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="lifeStage"
            className="block text-sm font-medium text-[#2B241B] mb-2"
          >
            {t("lifeStage")}
          </label>
          <select
            id="lifeStage"
            value={lifeStage}
            onChange={(e) => setLifeStage(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-[#D4C5B0] bg-white text-[#2B241B] focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-transparent"
          >
            <option value="">{t("lifeStagePlaceholder")}</option>
            <option value="teen">{t("lifeStageTeen")}</option>
            <option value="young_adult">{t("lifeStageYoungAdult")}</option>
            <option value="adult">{t("lifeStageAdult")}</option>
            <option value="midlife">{t("lifeStageMidlife")}</option>
            <option value="senior">{t("lifeStageSenior")}</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="timezone"
            className="block text-sm font-medium text-[#2B241B] mb-2"
          >
            {t("timezone")}
          </label>
          <input
            id="timezone"
            type="text"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-[#D4C5B0] bg-white text-[#2B241B] focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-[#8B7355] text-white font-medium hover:bg-[#7A6345] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? t("saving") : t("continue")}
        </button>
      </form>
    </div>
  );
}
