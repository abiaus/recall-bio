"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { updateProfileAction } from "@/server/actions/settings";
import { FloatingInput } from "@/components/ui/FloatingInput";
import { OrganicSelect } from "@/components/ui/OrganicSelect";
import { GlowButton } from "@/components/ui/GlowButton";
import { CheckCircle2, XCircle } from "lucide-react";

interface ProfileSettingsFormProps {
  initialDisplayName: string;
  initialLifeStage: string | null;
  initialTimezone: string;
  initialTranscriptionLanguage: string;
}

export function ProfileSettingsForm({
  initialDisplayName,
  initialLifeStage,
  initialTimezone,
  initialTranscriptionLanguage,
}: ProfileSettingsFormProps) {
  const t = useTranslations("settings.profile");
  const tOnboarding = useTranslations("onboarding");
  const tErrors = useTranslations("errors");
  const tTranscription = useTranslations("settings.transcription");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [lifeStage, setLifeStage] = useState(initialLifeStage || "");
  const [timezone, setTimezone] = useState(initialTimezone);
  const [transcriptionLanguage, setTranscriptionLanguage] = useState(
    initialTranscriptionLanguage || "en"
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    formData.set("displayName", displayName);
    formData.set("lifeStage", lifeStage);
    formData.set("timezone", timezone);
    formData.set("transcriptionLanguage", transcriptionLanguage);

    startTransition(async () => {
      const result = await updateProfileAction(formData);
      if (result.success) {
        setMessage({ type: "success", text: t("saved") });
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({
          type: "error",
          text: result.error || tErrors("saveError"),
        });
      }
    });
  };

  return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`rounded-2xl p-4 flex items-center gap-3 ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border-2 border-green-200"
                  : "bg-red-50 text-red-700 border-2 border-red-200"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">{message.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <FloatingInput
          id="displayName"
          label={t("displayName")}
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder={t("displayNamePlaceholder")}
          required
        />

        <OrganicSelect
          id="lifeStage"
          label={t("lifeStage")}
          value={lifeStage}
          onChange={setLifeStage}
          options={[
            { value: "teen", label: tOnboarding("lifeStageTeen") },
            { value: "young_adult", label: tOnboarding("lifeStageYoungAdult") },
            { value: "adult", label: tOnboarding("lifeStageAdult") },
            { value: "midlife", label: tOnboarding("lifeStageMidlife") },
            { value: "senior", label: tOnboarding("lifeStageSenior") },
          ]}
          placeholder={tOnboarding("lifeStagePlaceholder")}
        />

        <FloatingInput
          id="timezone"
          label={t("timezone")}
          type="text"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          required
        />

        <OrganicSelect
          id="transcriptionLanguage"
          label={tTranscription("language")}
          value={transcriptionLanguage}
          onChange={setTranscriptionLanguage}
          options={[
            { value: "en", label: tTranscription("languages.en") },
            { value: "es", label: tTranscription("languages.es") },
            { value: "pt", label: tTranscription("languages.pt") },
            { value: "fr", label: tTranscription("languages.fr") },
            { value: "de", label: tTranscription("languages.de") },
            { value: "it", label: tTranscription("languages.it") },
            { value: "zh", label: tTranscription("languages.zh") },
            { value: "ja", label: tTranscription("languages.ja") },
            { value: "ko", label: tTranscription("languages.ko") },
            { value: "ar", label: tTranscription("languages.ar") },
          ]}
          placeholder={tTranscription("languagePlaceholder")}
          required
        />

        <GlowButton
          type="submit"
          disabled={isPending}
          variant="primary"
          className="w-full"
        >
          {isPending ? t("saving") : t("save")}
        </GlowButton>
      </form>
  );
}
