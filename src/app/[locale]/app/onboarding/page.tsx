"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";
import { localePath } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ProgressCurve } from "@/components/ui/ProgressCurve";
import { LifeStageCard } from "@/components/ui/LifeStageCard";
import { OrganicSelect } from "@/components/ui/OrganicSelect";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import {
  DEFAULT_TRANSCRIPTION_LANGUAGE,
  VALID_TRANSCRIPTION_LANGUAGES,
} from "@/lib/transcription/constants";
import { Baby, GraduationCap, Briefcase, Users, Heart, CheckCircle2, ArrowRight } from "lucide-react";

const STEPS = 2;

export default function OnboardingPage() {
  const t = useTranslations("onboarding");
  const tCommon = useTranslations("common");
  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [lifeStage, setLifeStage] = useState<string>("");
  const [timezone, setTimezone] = useState<string>(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [loading, setLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const supabase = createClient();
  const transcriptionLanguage = VALID_TRANSCRIPTION_LANGUAGES.includes(
    locale as (typeof VALID_TRANSCRIPTION_LANGUAGES)[number]
  )
    ? locale
    : DEFAULT_TRANSCRIPTION_LANGUAGE;

  const timezoneOptions = useMemo(
    () => Intl.supportedValuesOf("timeZone").map((tz) => ({ value: tz, label: tz })),
    []
  );

  const lifeStages = [
    { value: "teen", label: t("lifeStageTeen"), icon: <Baby className="w-6 h-6" /> },
    { value: "young_adult", label: t("lifeStageYoungAdult"), icon: <GraduationCap className="w-6 h-6" /> },
    { value: "adult", label: t("lifeStageAdult"), icon: <Briefcase className="w-6 h-6" /> },
    { value: "midlife", label: t("lifeStageMidlife"), icon: <Users className="w-6 h-6" /> },
    { value: "senior", label: t("lifeStageSenior"), icon: <Heart className="w-6 h-6" /> },
  ];

  const handleNext = () => {
    if (currentStep < STEPS - 1) {
      setIsTransitioning(true);
      setCurrentStep(currentStep + 1);
      setTimeout(() => setIsTransitioning(false), 400);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setIsTransitioning(true);
      setCurrentStep(currentStep - 1);
      setTimeout(() => setIsTransitioning(false), 400);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push(localePath("/auth/login", locale));
      return;
    }

    const { error } = await supabase
      .schema("public")
      .from("profiles")
      .upsert({
        id: user.id,
        display_name: user.user_metadata?.display_name || "",
        life_stage: lifeStage,
        timezone,
        transcription_language: transcriptionLanguage,
      })
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      setLoading(false);
    } else {
      setIsCompleted(true);
      setTimeout(() => {
        router.push(localePath("/app/today", locale));
        router.refresh();
      }, 2000);
    }
  };

  if (isCompleted) {
    return (
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[50vh] space-y-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.1
          }}
          className="w-24 h-24 rounded-full bg-[var(--primary-terracotta)] flex items-center justify-center text-white shadow-xl shadow-[var(--primary-terracotta)]/20"
        >
          <CheckCircle2 className="w-12 h-12" />
        </motion.div>

        <div className="space-y-3">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl font-serif text-[var(--text-primary)]"
          >
            {t("readyTitle")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-lg text-[var(--text-secondary)]"
          >
            {t("readySubtitle")}
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-4">
        <motion.h1
          className="font-serif text-4xl font-bold text-[var(--text-primary)]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {t("title")}
        </motion.h1>
        <motion.p
          className="text-[var(--text-secondary)] text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {t("subtitle")}
        </motion.p>
      </div>

      <ProgressCurve steps={STEPS} currentStep={currentStep} className="mb-8" />

      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatedCard className="p-8">
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">
                  {t("lifeStage")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lifeStages.map((stage) => (
                    <LifeStageCard
                      key={stage.value}
                      value={stage.value}
                      label={stage.label}
                      icon={stage.icon}
                      selected={lifeStage === stage.value}
                      onSelect={setLifeStage}
                    />
                  ))}
                </div>
              </AnimatedCard>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatedCard className="p-8">
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">
                  {t("timezone")}
                </h2>
                <div className="h-[250px]">
                  <OrganicSelect
                    id="timezone"
                    label={t("timezone")}
                    value={timezone}
                    onChange={setTimezone}
                    options={timezoneOptions}
                    required
                  />
                </div>
              </AnimatedCard>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-4 pt-4">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={handleBack}
              disabled={isTransitioning}
              className="flex-1 inline-flex items-center justify-center px-8 py-4 text-base font-medium text-[var(--text-primary)] border border-[#D4C5B0] bg-transparent hover:border-[var(--text-primary)] hover:bg-white hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-terracotta)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {tCommon("back")}
            </button>
          )}
          {currentStep < STEPS - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={isTransitioning || (currentStep === 0 && !lifeStage)}
              className="group flex-1 inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-[var(--text-primary)] hover:bg-[var(--text-secondary)] transition-colors duration-300 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[var(--primary-terracotta)] focus:ring-offset-2"
            >
              {t("continue")}
              <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 w-0 overflow-hidden group-hover:w-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isTransitioning || loading || !lifeStage || !timezone}
              className="group flex-1 inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-[var(--text-primary)] hover:bg-[var(--text-secondary)] transition-colors duration-300 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[var(--primary-terracotta)] focus:ring-offset-2"
            >
              <span className="relative">
                {loading ? t("saving") : t("continue")}
              </span>
              {!loading && (
                <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 w-0 overflow-hidden group-hover:w-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out" />
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
