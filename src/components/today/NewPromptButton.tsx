"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { assignNextDailyPrompt, getOrAssignDailyPrompt } from "@/server/actions/dailyPrompt";
import { useTranslations, useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { GlowButton } from "@/components/ui/GlowButton";
import { Sparkles } from "lucide-react";

interface NewPromptButtonProps {
  hasExistingPrompt?: boolean;
}

export function NewPromptButton({ hasExistingPrompt = true }: NewPromptButtonProps) {
  const t = useTranslations("today");
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleNewPrompt = async () => {
    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError(t("newPromptError"));
        return;
      }

      // If no existing prompt, use getOrAssignDailyPrompt to create the first one
      // Otherwise, use assignNextDailyPrompt to get the next one
      const result = hasExistingPrompt
        ? await assignNextDailyPrompt(user.id, undefined, locale)
        : await getOrAssignDailyPrompt(user.id, undefined, locale);

      if (result.status === "no_questions") {
        setError(t("noPrompts"));
        return;
      }

      if (result.status !== "assigned") {
        setError(t("newPromptError"));
        return;
      }

      // Refresh the page to show the new prompt
      router.refresh();
    } catch (err) {
      console.error("Error getting new prompt:", err);
      setError(t("newPromptError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <GlowButton
        onClick={handleNewPrompt}
        disabled={loading}
        variant="secondary"
        className="flex items-center gap-2"
      >
        <Sparkles className="w-4 h-4" />
        {loading ? t("newPromptLoading") : t("newPrompt")}
      </GlowButton>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
