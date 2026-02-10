"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useMemo } from "react";
import { Accordion } from "@/components/ui/Accordion";
import { ProfileSettingsForm } from "./ProfileSettingsForm";
import { PasswordSettingsForm } from "./PasswordSettingsForm";
import { LogoutSection } from "./LogoutSection";
import { User, Lock, LogOut, Loader2 } from "lucide-react";
import { containerVariants, itemVariants } from "@/components/ui/animations";
import { AnimatedCard } from "@/components/ui/AnimatedCard";

export function SettingsContent() {
  const t = useTranslations("nav");
  const tSettings = useTranslations("settings.profile");
  const tTranscription = useTranslations("settings.transcription");
  const tAccount = useTranslations("settings.account");
  const tSession = useTranslations("settings.session");
  const [profile, setProfile] = useState<{
    displayName: string;
    lifeStage: string | null;
    timezone: string;
    plan: string;
    transcriptionLanguage: string;
    transcriptionLimit: number | null;
    transcriptionUsage: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const [{ data: profileData }, { count: monthlyUsage }] = await Promise.all([
            supabase
              .schema("public")
              .from("profiles")
              .select("display_name, life_stage, timezone, transcription_language, plan")
              .eq("id", user.id)
              .single(),
            supabase
              .schema("public")
              .from("memory_media")
              .select("id", { count: "exact", head: true })
              .eq("user_id", user.id)
              .eq("kind", "audio")
              .in("transcript_status", ["pending", "processing", "completed", "failed"])
              .gte(
                "created_at",
                new Date(
                  Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1)
                ).toISOString()
              ),
          ]);

          const plan = profileData?.plan || "free";
          const { data: planFeature } = await supabase
            .schema("public")
            .from("plan_features")
            .select("limit_value")
            .eq("plan", plan)
            .eq("feature_key", "transcription")
            .maybeSingle();

          if (profileData) {
            setProfile({
              displayName: profileData.display_name || "",
              lifeStage: profileData.life_stage,
              timezone:
                profileData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
              plan,
              transcriptionLanguage: profileData.transcription_language || "en",
              transcriptionLimit:
                typeof planFeature?.limit_value === "number"
                  ? planFeature.limit_value
                  : null,
              transcriptionUsage: monthlyUsage || 0,
            });
          } else {
            // Si no hay perfil, establecer valores por defecto
            setProfile({
              displayName: "",
              lifeStage: null,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              plan: "free",
              transcriptionLanguage: "en",
              transcriptionLimit: null,
              transcriptionUsage: monthlyUsage || 0,
            });
          }
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        // Establecer valores por defecto en caso de error
        setProfile({
          displayName: "",
          lifeStage: null,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          plan: "free",
          transcriptionLanguage: "en",
          transcriptionLimit: null,
          transcriptionUsage: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, [supabase]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <AnimatedCard className="p-8 flex items-center gap-4">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--primary-terracotta)]" />
          <span className="text-[var(--text-secondary)]">{t("settings")}...</span>
        </AnimatedCard>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-12">
        <AnimatedCard className="p-8 text-center">
          <span className="text-[var(--text-secondary)]">Error al cargar el perfil</span>
        </AnimatedCard>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        variants={itemVariants}
        className="font-serif text-4xl font-bold text-[var(--text-primary)]"
      >
        {t("settings")}
      </motion.h1>

      <motion.div className="space-y-4" variants={containerVariants}>
        <motion.div variants={itemVariants}>
          <Accordion
            title={tSettings("title")}
            subtitle={tSettings("subtitle")}
            icon={<User className="w-5 h-5" />}
            defaultOpen={true}
          >
            <ProfileSettingsForm
              initialDisplayName={profile.displayName}
              initialLifeStage={profile.lifeStage}
              initialTimezone={profile.timezone}
              initialTranscriptionLanguage={profile.transcriptionLanguage}
            />
            <div className="mt-5 rounded-2xl border border-[var(--bg-warm)] bg-white/70 p-4">
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {tTranscription("monthlyUsageTitle")}
              </p>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                {profile.transcriptionLimit === null
                  ? tTranscription("monthlyUsageUnlimited", {
                      used: profile.transcriptionUsage,
                      plan: profile.plan.toUpperCase(),
                    })
                  : tTranscription("monthlyUsageLimited", {
                      used: profile.transcriptionUsage,
                      limit: profile.transcriptionLimit,
                      plan: profile.plan.toUpperCase(),
                    })}
              </p>
            </div>
          </Accordion>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Accordion
            title={tAccount("title")}
            subtitle={tAccount("subtitle")}
            icon={<Lock className="w-5 h-5" />}
          >
            <PasswordSettingsForm />
          </Accordion>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Accordion
            title={tSession("title")}
            subtitle={tSession("subtitle")}
            icon={<LogOut className="w-5 h-5" />}
          >
            <LogoutSection />
          </Accordion>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
