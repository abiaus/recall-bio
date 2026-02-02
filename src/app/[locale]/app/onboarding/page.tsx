"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ProgressCurve } from "@/components/ui/ProgressCurve";
import { LifeStageCard } from "@/components/ui/LifeStageCard";
import { FloatingInput } from "@/components/ui/FloatingInput";
import { GlowButton } from "@/components/ui/GlowButton";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { Baby, GraduationCap, Briefcase, Users, Heart, CheckCircle2 } from "lucide-react";

const STEPS = 2;

export default function OnboardingPage() {
  const t = useTranslations("onboarding");
  const tCommon = useTranslations("common");
  const [currentStep, setCurrentStep] = useState(0);
  const [lifeStage, setLifeStage] = useState<string>("");
  const [timezone, setTimezone] = useState<string>(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const supabase = createClient();

  const lifeStages = [
    { value: "teen", label: t("lifeStageTeen"), icon: <Baby className="w-6 h-6" /> },
    { value: "young_adult", label: t("lifeStageYoungAdult"), icon: <GraduationCap className="w-6 h-6" /> },
    { value: "adult", label: t("lifeStageAdult"), icon: <Briefcase className="w-6 h-6" /> },
    { value: "midlife", label: t("lifeStageMidlife"), icon: <Users className="w-6 h-6" /> },
    { value: "senior", label: t("lifeStageSenior"), icon: <Heart className="w-6 h-6" /> },
  ];

  const handleNext = () => {
    if (currentStep < STEPS - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push(`/${locale}/auth/login`);
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
      })
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      setLoading(false);
    } else {
      setCompleted(true);
      setTimeout(() => {
        router.push(`/${locale}/app/today`);
        router.refresh();
      }, 2000);
    }
  };

  if (completed) {
    return (
      <motion.div
        className="max-w-2xl mx-auto text-center space-y-6 py-16"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <motion.div
          className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[var(--primary-terracotta)] to-[var(--accent-sage)] flex items-center justify-center"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <CheckCircle2 className="w-12 h-12 text-white" />
        </motion.div>
        <h2 className="font-serif text-3xl font-bold text-[var(--text-primary)]">
          {t("welcomeTitle")}
        </h2>
        <p className="text-[var(--text-secondary)] text-lg">
          {t("preparingExperience")}
        </p>
      </motion.div>
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
                <FloatingInput
                  id="timezone"
                  label={t("timezone")}
                  type="text"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  required
                />
              </AnimatedCard>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-4">
          {currentStep > 0 && (
            <GlowButton
              type="button"
              variant="ghost"
              onClick={handleBack}
              className="flex-1"
            >
              {tCommon("back")}
            </GlowButton>
          )}
          {currentStep < STEPS - 1 ? (
            <GlowButton
              type="button"
              variant="primary"
              onClick={handleNext}
              disabled={currentStep === 0 && !lifeStage}
              className="flex-1"
            >
              {t("continue")}
            </GlowButton>
          ) : (
            <GlowButton
              type="submit"
              variant="primary"
              disabled={loading || !lifeStage || !timezone}
              glow={!loading && !!lifeStage && !!timezone}
              className="flex-1"
            >
              {loading ? t("saving") : t("continue")}
            </GlowButton>
          )}
        </div>
      </form>
    </div>
  );
}
