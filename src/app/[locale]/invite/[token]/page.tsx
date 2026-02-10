"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { acceptInvitationByToken, verifyInvitationToken } from "@/server/actions/legacy";
import { createClient } from "@/lib/supabase/client";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { containerVariants, itemVariants } from "@/components/ui/animations";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Mail, Loader2 } from "lucide-react";

type InviteStatus =
  | "loading"
  | "invalid"
  | "requiresAuth"
  | "emailMismatch"
  | "accepted"
  | "error";

export default function InviteAcceptPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  const locale = params.locale as string;
  const t = useTranslations("legacy.inviteAccept");
  const tAuth = useTranslations("auth");

  const [status, setStatus] = useState<InviteStatus>("loading");
  const [heirEmail, setHeirEmail] = useState<string | null>(null);
  const [accountEmail, setAccountEmail] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    let cancelled = false;

    const handleAccept = async () => {
      const result = await acceptInvitationByToken(token);
      if (cancelled) return;
      if (result.success) {
        setStatus("accepted");
        setTimeout(() => {
          router.push(`/${locale}/app/legacy`);
          router.refresh();
        }, 2000);
      } else if (result.error?.includes("email")) {
        setStatus("emailMismatch");
        setAccountEmail(result.error.match(/accountEmail: (\S+)/)?.[1] || null);
        setHeirEmail(result.heirEmail || null);
      } else {
        setStatus("invalid");
        setErrorMessage(result.error || "Invalid invitation");
      }
    };

    const run = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (cancelled) return;
        if (user) {
          setAccountEmail(user.email || null);
          await handleAccept();
        } else {
          const result = await verifyInvitationToken(token);
          if (cancelled) return;
          if (result.valid) {
            setStatus("requiresAuth");
            setHeirEmail(result.heirEmail || null);
          } else {
            setStatus("invalid");
            setErrorMessage(result.error || "Invalid invitation");
          }
        }
      } catch (error) {
        if (cancelled) return;
        console.error("Error checking invitation:", error);
        setStatus("error");
        setErrorMessage("An error occurred. Please try again.");
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [token, locale, supabase, router]);

  if (status === "loading") {
    return (
      <div className="min-h-dvh flex items-center justify-center px-4" style={{ background: "var(--bg-cream)" }}>
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Loader2 className="w-12 h-12 text-[var(--primary-terracotta)] mx-auto mb-4 animate-spin" />
          <p className="text-[var(--text-secondary)]">{t("accepting")}</p>
        </motion.div>
      </div>
    );
  }

  if (status === "accepted") {
    return (
      <div className="min-h-dvh flex items-center justify-center px-4" style={{ background: "var(--bg-cream)" }}>
        <motion.div
          className="w-full max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatedCard className="p-8 text-center">
            <motion.div variants={itemVariants}>
              <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h1 className="font-serif text-2xl font-semibold text-[var(--text-primary)] mb-4">
                {t("accepted")}
              </h1>
              <p className="text-[var(--text-secondary)] mb-6">
                {t("acceptedDescription")}
              </p>
            </motion.div>
          </AnimatedCard>
        </motion.div>
      </div>
    );
  }

  if (status === "invalid" || status === "error") {
    return (
      <div className="min-h-dvh flex items-center justify-center px-4" style={{ background: "var(--bg-cream)" }}>
        <motion.div
          className="w-full max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatedCard className="p-8 text-center">
            <motion.div variants={itemVariants}>
              <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h1 className="font-serif text-2xl font-semibold text-[var(--text-primary)] mb-4">
                {t("invalidToken")}
              </h1>
              <p className="text-[var(--text-secondary)] mb-6">
                {errorMessage || t("invalidTokenDescription")}
              </p>
              <Link href={`/${locale}`}>
                <GlowButton variant="primary">
                  {tAuth("backToLogin")}
                </GlowButton>
              </Link>
            </motion.div>
          </AnimatedCard>
        </motion.div>
      </div>
    );
  }

  if (status === "emailMismatch") {
    return (
      <div className="min-h-dvh flex items-center justify-center px-4" style={{ background: "var(--bg-cream)" }}>
        <motion.div
          className="w-full max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatedCard className="p-8 text-center">
            <motion.div variants={itemVariants}>
              <Mail className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
              <h1 className="font-serif text-2xl font-semibold text-[var(--text-primary)] mb-4">
                {t("emailMismatch")}
              </h1>
              <p className="text-[var(--text-secondary)] mb-6">
                {t("emailMismatchDescription", {
                  accountEmail: accountEmail || "unknown",
                  invitationEmail: heirEmail || "unknown",
                })}
              </p>
              <div className="space-y-3">
                <Link href={`/${locale}/auth/logout`}>
                  <GlowButton variant="secondary" className="w-full">
                    {tAuth("logout")}
                  </GlowButton>
                </Link>
                <Link href={`/${locale}`}>
                  <GlowButton variant="ghost" className="w-full">
                    {tAuth("backToLogin")}
                  </GlowButton>
                </Link>
              </div>
            </motion.div>
          </AnimatedCard>
        </motion.div>
      </div>
    );
  }

  // status === "requiresAuth"
  return (
    <div className="min-h-dvh flex items-center justify-center px-4" style={{ background: "var(--bg-cream)" }}>
      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatedCard className="p-8">
          <motion.div variants={itemVariants} className="text-center mb-6">
            <Mail className="w-16 h-16 text-[var(--primary-terracotta)] mx-auto mb-4" />
            <h1 className="font-serif text-2xl font-semibold text-[var(--text-primary)] mb-4">
              {t("title")}
            </h1>
            <p className="text-[var(--text-secondary)] mb-2">
              {t("description")}
            </p>
            {heirEmail && (
              <p className="text-sm text-[var(--text-muted)] mt-4">
                {tAuth("email")}: <strong>{heirEmail}</strong>
              </p>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-3">
            <Link href={`/${locale}/auth/login?redirect=/invite/${token}`}>
              <GlowButton variant="primary" className="w-full">
                {t("signInToAccept")}
              </GlowButton>
            </Link>
            <Link href={`/${locale}/auth/signup?email=${encodeURIComponent(heirEmail || "")}&redirect=/invite/${token}`}>
              <GlowButton variant="secondary" className="w-full">
                {t("signUpToAccept")}
              </GlowButton>
            </Link>
          </motion.div>
        </AnimatedCard>
      </motion.div>
    </div>
  );
}
