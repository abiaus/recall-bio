import { createClient } from "@/lib/supabase/server";
import { getOrAssignDailyPrompt } from "@/server/actions/dailyPrompt";
import { MemoryComposer } from "@/components/memories/MemoryComposer";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function TodayPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("today");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  const prompt = await getOrAssignDailyPrompt(user.id);

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-semibold text-[#2B241B]">
        {t("title")}
      </h1>

      {prompt ? (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#F6F1E7] border border-[#D4C5B0]">
            <p className="font-serif text-xl text-[#2B241B] leading-relaxed">
              {prompt.text}
            </p>
          </div>

          <MemoryComposer questionId={prompt.question_id} />
        </div>
      ) : (
        <p className="text-[#5A4A3A]">{t("noPrompts")}</p>
      )}
    </div>
  );
}
