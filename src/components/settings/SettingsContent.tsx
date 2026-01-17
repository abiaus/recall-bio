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
  const tAccount = useTranslations("settings.account");
  const tSession = useTranslations("settings.session");
  const [profile, setProfile] = useState<{
    displayName: string;
    lifeStage: string | null;
    timezone: string;
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
          const { data } = await supabase
            .schema("public")
            .from("profiles")
            .select("display_name, life_stage, timezone")
            .eq("id", user.id)
            .single();

          if (data) {
            setProfile({
              displayName: data.display_name || "",
              lifeStage: data.life_stage,
              timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
            });
          } else {
            // Si no hay perfil, establecer valores por defecto
            setProfile({
              displayName: "",
              lifeStage: null,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
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
            />
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
