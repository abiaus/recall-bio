"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  getNextQuestionToRate,
  submitQuestionRating,
  type NextQuestionToRateResult,
} from "@/server/actions/questionRatings";

type QuestionToRate = NonNullable<NextQuestionToRateResult["question"]>;

type QuestionRatingFlowProps = {
  initialQuestion: QuestionToRate | null;
};

function formatCategory(category: string): string {
  if (!category) return "general";
  const normalized = category.replace(/[_-]/g, " ").trim();
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

type RatingScaleProps = {
  label: string;
  minLabel: string;
  maxLabel: string;
  value: number | null;
  onChange: (value: number) => void;
  disabled?: boolean;
};

function RatingScale({
  label,
  minLabel,
  maxLabel,
  value,
  onChange,
  disabled = false,
}: RatingScaleProps) {
  return (
    <fieldset className="space-y-3" disabled={disabled}>
      <legend className="text-sm sm:text-base font-medium text-[var(--text-primary)] mb-2">
        {label}
      </legend>
      <div
        className="flex items-center gap-2 sm:gap-3"
        role="radiogroup"
        aria-label={label}
      >
        {[1, 2, 3, 4, 5].map((option) => {
          const selected = value === option;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`${label} ${option}`}
              onClick={() => onChange(option)}
              disabled={disabled}
              className={`h-11 w-11 sm:h-10 sm:w-10 rounded-full border text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary-terracotta)] focus:ring-offset-2 ${
                selected
                  ? "bg-[var(--primary-terracotta)] text-white border-[var(--primary-terracotta)]"
                  : "bg-white text-[var(--text-secondary)] border-[#D4C5B0] hover:border-[var(--primary-terracotta)]"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-[var(--text-muted)]">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </fieldset>
  );
}

export function QuestionRatingFlow({ initialQuestion }: QuestionRatingFlowProps) {
  const t = useTranslations("questionRating");
  const locale = useLocale();

  const [question, setQuestion] = useState<QuestionToRate | null>(initialQuestion);
  const [difficultyToAnswer, setDifficultyToAnswer] = useState<number | null>(null);
  const [clarity, setClarity] = useState<number | null>(null);
  const [correctCategory, setCorrectCategory] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const canSubmit =
    !!question &&
    difficultyToAnswer !== null &&
    clarity !== null &&
    correctCategory !== null &&
    !isPending;

  const resetAnswers = () => {
    setDifficultyToAnswer(null);
    setClarity(null);
    setCorrectCategory(null);
  };

  const handleSubmit = () => {
    if (!question || !canSubmit) {
      return;
    }

    const currentQuestionId = question.id;
    const currentDifficultyToAnswer = difficultyToAnswer;
    const currentClarity = clarity;
    const currentCorrectCategory = correctCategory;

    if (
      currentDifficultyToAnswer === null ||
      currentClarity === null ||
      currentCorrectCategory === null
    ) {
      return;
    }

    setErrorMessage(null);

    startTransition(async () => {
      const saveResult = await submitQuestionRating(currentQuestionId, {
        difficultyToAnswer: currentDifficultyToAnswer,
        clarity: currentClarity,
        correctCategory: currentCorrectCategory,
      });

      if (!saveResult.success) {
        setErrorMessage(saveResult.error ?? t("genericError"));
        return;
      }

      resetAnswers();

      const nextResult = await getNextQuestionToRate(locale);
      if (!nextResult.success) {
        setErrorMessage(nextResult.error ?? t("genericError"));
        return;
      }

      setQuestion(nextResult.question);
    });
  };

  if (!question) {
    return (
      <div className="rounded-2xl border border-[#D4C5B0]/60 bg-white/80 p-6 sm:p-8 text-center">
        <h2 className="font-serif text-2xl text-[var(--text-primary)]">{t("allRated")}</h2>
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="rounded-2xl border border-[#D4C5B0]/60 bg-white/80 p-5 sm:p-6">
        <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2">
          {t("questionLabel")}
        </p>
        <p className="font-serif text-lg sm:text-xl text-[var(--text-primary)] leading-relaxed">
          {question.text}
        </p>
      </div>

      <div className="rounded-2xl border border-[#D4C5B0]/60 bg-white/80 p-5 sm:p-6 space-y-6">
        <RatingScale
          label={t("difficultyToAnswer")}
          minLabel={t("scaleVeryEasy")}
          maxLabel={t("scaleVeryHard")}
          value={difficultyToAnswer}
          onChange={setDifficultyToAnswer}
          disabled={isPending}
        />

        <RatingScale
          label={t("clarity")}
          minLabel={t("scaleVeryClear")}
          maxLabel={t("scaleVeryConfusing")}
          value={clarity}
          onChange={setClarity}
          disabled={isPending}
        />

        <fieldset className="space-y-3" disabled={isPending}>
          <legend className="text-sm sm:text-base font-medium text-[var(--text-primary)]">
            {t("categoryMatch", { category: formatCategory(question.category) })}
          </legend>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setCorrectCategory(true)}
              aria-pressed={correctCategory === true}
              className={`min-h-[44px] px-4 py-2 rounded-md border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary-terracotta)] focus:ring-offset-2 ${
                correctCategory === true
                  ? "bg-[var(--accent-sage)]/20 border-[var(--accent-sage)] text-[var(--text-primary)]"
                  : "bg-white border-[#D4C5B0] text-[var(--text-secondary)] hover:border-[var(--primary-terracotta)]"
              }`}
            >
              {t("yes")}
            </button>
            <button
              type="button"
              onClick={() => setCorrectCategory(false)}
              aria-pressed={correctCategory === false}
              className={`min-h-[44px] px-4 py-2 rounded-md border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary-terracotta)] focus:ring-offset-2 ${
                correctCategory === false
                  ? "bg-[var(--primary-terracotta)]/15 border-[var(--primary-terracotta)] text-[var(--text-primary)]"
                  : "bg-white border-[#D4C5B0] text-[var(--text-secondary)] hover:border-[var(--primary-terracotta)]"
              }`}
            >
              {t("no")}
            </button>
          </div>
        </fieldset>
      </div>

      {errorMessage ? (
        <p className="text-sm text-[var(--primary-terracotta)]" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="inline-flex min-h-[44px] items-center justify-center px-6 py-3 rounded-md bg-[var(--text-primary)] text-white text-sm font-medium hover:bg-[var(--text-secondary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[var(--primary-terracotta)] focus:ring-offset-2"
      >
        {isPending ? t("submitting") : t("submit")}
      </button>
    </div>
  );
}
