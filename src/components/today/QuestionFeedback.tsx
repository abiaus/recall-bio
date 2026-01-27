"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { submitQuestionFeedback } from "@/server/actions/questionFeedback";

interface QuestionFeedbackProps {
  questionId: string;
  initialFeedback?: "up" | "down" | null;
}

export function QuestionFeedback({
  questionId,
  initialFeedback = null,
}: QuestionFeedbackProps) {
  const t = useTranslations("today.feedback");
  const [currentRating, setCurrentRating] = useState<"up" | "down" | null>(
    initialFeedback
  );
  const [isPending, startTransition] = useTransition();

  const handleFeedback = (rating: "up" | "down") => {
    // Si ya está seleccionado, deseleccionar (toggle)
    const previousRating = currentRating;
    const newRating = currentRating === rating ? null : rating;

    // Actualización optimista
    setCurrentRating(newRating);

    startTransition(async () => {
      const result = await submitQuestionFeedback(questionId, newRating);
      if (!result.success) {
        // Revertir en caso de error
        setCurrentRating(previousRating);
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      {/* Thumbs Up Button */}
      <motion.button
        type="button"
        onClick={() => handleFeedback("up")}
        disabled={isPending}
        aria-label={t("thumbsUpLabel")}
        className={`
          relative p-2 sm:p-2.5 rounded-lg
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          min-w-[44px] min-h-[44px] sm:min-w-[40px] sm:min-h-[40px]
          flex items-center justify-center
          ${
            currentRating === "up"
              ? "bg-[var(--accent-sage)]/20 text-[var(--accent-sage)]"
              : "bg-transparent text-[var(--text-muted)] hover:text-[var(--primary-terracotta)] hover:bg-[var(--primary-terracotta)]/10"
          }
        `}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.3 }}
      >
        <ThumbsUp
          className={`w-5 h-5 sm:w-4 sm:h-4 ${
            currentRating === "up" ? "fill-current" : ""
          }`}
        />
      </motion.button>

      {/* Thumbs Down Button */}
      <motion.button
        type="button"
        onClick={() => handleFeedback("down")}
        disabled={isPending}
        aria-label={t("thumbsDownLabel")}
        className={`
          relative p-2 sm:p-2.5 rounded-lg
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          min-w-[44px] min-h-[44px] sm:min-w-[40px] sm:min-h-[40px]
          flex items-center justify-center
          ${
            currentRating === "down"
              ? "bg-[var(--primary-terracotta)]/20 text-[var(--primary-terracotta)]"
              : "bg-transparent text-[var(--text-muted)] hover:text-[var(--primary-terracotta)] hover:bg-[var(--primary-terracotta)]/10"
          }
        `}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.3 }}
      >
        <ThumbsDown
          className={`w-5 h-5 sm:w-4 sm:h-4 ${
            currentRating === "down" ? "fill-current" : ""
          }`}
        />
      </motion.button>
    </div>
  );
}
