"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Sparkles, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { localePath } from "@/i18n/routing";

type RatingBannerProps = {
  ratedCount: number;
  totalQuestions: number;
};

const DISMISS_STORAGE_KEY = "question-rating-banner:dismissed:v1";

export function RatingBanner({ ratedCount, totalQuestions }: RatingBannerProps) {
  const t = useTranslations("questionRating");
  const locale = useLocale();
  const [isDismissed, setIsDismissed] = useState(false);
  const [hasLoadedPreference, setHasLoadedPreference] = useState(false);

  useEffect(() => {
    try {
      const value = window.sessionStorage.getItem(DISMISS_STORAGE_KEY);
      setIsDismissed(value === "true");
    } catch {
      setIsDismissed(false);
    } finally {
      setHasLoadedPreference(true);
    }
  }, []);

  const isCompleted = useMemo(() => {
    if (totalQuestions <= 0) return false;
    return ratedCount >= totalQuestions;
  }, [ratedCount, totalQuestions]);

  if (!hasLoadedPreference || isDismissed || isCompleted) {
    return null;
  }

  return (
    <section
      className="mb-6 rounded-xl border border-[var(--primary-terracotta)]/20 border-l-4 bg-[var(--primary-terracotta)]/8 p-4 sm:p-5"
      aria-label={t("bannerTitle")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 text-[var(--primary-terracotta)]" aria-hidden="true">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">{t("bannerTitle")}</p>
            <p className="text-sm text-[var(--text-secondary)]">{t("bannerSubtitle")}</p>
            <Link
              href={localePath("/app/rate-questions", locale)}
              className="mt-2 inline-flex min-h-[44px] items-center text-sm font-medium text-[var(--primary-terracotta)] hover:text-[var(--text-primary)] underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary-terracotta)] focus:ring-offset-2 rounded-sm"
            >
              {t("bannerCta")}
            </Link>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsDismissed(true);
            try {
              window.sessionStorage.setItem(DISMISS_STORAGE_KEY, "true");
            } catch {
              // Ignore storage failures to avoid breaking UI.
            }
          }}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[var(--text-muted)] hover:bg-white/70 hover:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-terracotta)] focus:ring-offset-2"
          aria-label={t("bannerDismiss")}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
