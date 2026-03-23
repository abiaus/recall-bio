import { getTranslations } from "next-intl/server";
import { QuestionRatingFlow } from "@/components/ratings/QuestionRatingFlow";
import { getNextQuestionToRate } from "@/server/actions/questionRatings";

export default async function RateQuestionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("questionRating");

  const nextQuestionResult = await getNextQuestionToRate(locale);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header className="space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl text-[var(--text-primary)]">
          {t("pageTitle")}
        </h1>
        <p className="text-[var(--text-secondary)]">{t("pageSubtitle")}</p>
      </header>

      <QuestionRatingFlow
        initialQuestion={nextQuestionResult.success ? nextQuestionResult.question : null}
      />
    </div>
  );
}
