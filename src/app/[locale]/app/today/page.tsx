import { createClient } from "@/lib/supabase/server";
import { getOrAssignDailyPrompt } from "@/server/actions/dailyPrompt";
import { getQuestionFeedback } from "@/server/actions/questionFeedback";
import { MemoryComposer } from "@/components/memories/MemoryComposer";
import { NewPromptButton } from "@/components/today/NewPromptButton";
import { TodayHero } from "@/components/today/TodayHero";
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

  const promptResult = await getOrAssignDailyPrompt(user.id, new Date(), locale);
  const prompt = promptResult.status === "assigned" ? promptResult : null;
  const canRequestNewPrompt = promptResult.status !== "no_questions";

  // Obtener feedback inicial si hay un prompt
  let initialFeedback: "up" | "down" | null = null;
  if (prompt) {
    const feedbackResult = await getQuestionFeedback(prompt.question_id);
    if (feedbackResult.success && feedbackResult.rating) {
      initialFeedback = feedbackResult.rating;
    }
  }

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col">
      {prompt ? (
        <>
          <TodayHero 
            promptText={prompt.text}
            questionId={prompt.question_id}
            canRequestNewPrompt={canRequestNewPrompt}
            initialFeedback={initialFeedback}
          />
          <div className="flex-1 mt-8">
            <MemoryComposer questionId={prompt.question_id} />
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-6 max-w-md mx-auto px-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[var(--blob-peach)] to-[var(--blob-lavender)] flex items-center justify-center">
              <span className="text-4xl">✨</span>
            </div>
            <div>
              <h2 className="font-serif text-2xl text-[var(--text-primary)] mb-2">
                {t("noPromptsTitle")}
              </h2>
              <p className="text-[var(--text-secondary)]">{t("noPrompts")}</p>
            </div>
            {canRequestNewPrompt && <NewPromptButton hasExistingPrompt={false} />}
          </div>
        </div>
      )}
    </div>
  );
}
