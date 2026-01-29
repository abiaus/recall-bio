"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { NewPromptButton } from "./NewPromptButton";
import { QuestionFeedback } from "./QuestionFeedback";
import { Quote } from "lucide-react";

interface TodayHeroProps {
  promptText: string;
  questionId: string;
  canRequestNewPrompt: boolean;
  initialFeedback?: "up" | "down" | null;
}

export function TodayHero({
  promptText,
  questionId,
  canRequestNewPrompt,
  initialFeedback,
}: TodayHeroProps) {
  const t = useTranslations("today");
  const locale = useLocale();

  const today = new Date();
  const dateLocale = locale === "es" ? "es-ES" : "en-US";
  const formattedDate = today.toLocaleDateString(dateLocale, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="relative">
      {/* Decorative background elements */}
      <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-gradient-to-br from-[var(--blob-peach)] to-transparent opacity-60 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br from-[var(--blob-sage)] to-transparent opacity-50 blur-2xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        {/* Date & Title Header */}
        <div className="mb-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm uppercase tracking-widest text-[var(--text-muted)] font-medium"
          >
            {formattedDate}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="font-serif text-4xl md:text-5xl font-semibold text-[var(--text-primary)] mt-2 tracking-tight"
          >
            {t("title")}
          </motion.h1>
        </div>

        {/* Prompt Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-terracotta)]/10 via-[var(--accent-dusty-rose)]/10 to-[var(--accent-lavender)]/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/90 to-[var(--bg-warm)]/80 backdrop-blur-sm border border-[var(--primary-terracotta)]/15 shadow-lg shadow-[var(--primary-terracotta)]/5">
            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--blob-lavender)] to-transparent opacity-30 rounded-bl-full" />

            <div className="relative p-5 sm:p-8 md:p-10">
              {/* Quote icon */}
              <motion.div
                initial={{ opacity: 0, rotate: -10 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="absolute top-5 left-5 sm:top-6 sm:left-6 md:top-8 md:left-8"
              >
                <Quote className="w-8 h-8 text-[var(--primary-terracotta)]/20 fill-[var(--primary-terracotta)]/10" />
              </motion.div>

              {/* Prompt text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="font-serif text-xl md:text-2xl lg:text-3xl text-[var(--text-primary)] leading-relaxed md:leading-relaxed pl-8 sm:pl-10 md:pl-12 pr-4"
              >
                {promptText}
              </motion.p>

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
                className="mt-6 sm:mt-8 pl-8 sm:pl-10 md:pl-12 flex items-center gap-4 flex-wrap"
              >
                <QuestionFeedback
                  questionId={questionId}
                  initialFeedback={initialFeedback}
                />
                {canRequestNewPrompt && (
                  <NewPromptButton hasExistingPrompt={true} />
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
