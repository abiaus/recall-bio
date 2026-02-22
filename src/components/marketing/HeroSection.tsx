"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { trackCTAClick } from "@/lib/analytics";
import { Sparkles } from "lucide-react";
import { MarketingHeader } from "./MarketingHeader";

export function HeroSection() {
  const t = useTranslations("marketing.hero");

  return (
    <section className="relative min-h-[100vh] flex flex-col px-4 pt-0 overflow-hidden bg-[var(--bg-cream)]">
      <MarketingHeader />

      {/* Gradient background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[var(--primary-terracotta)]/8 to-transparent blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[var(--accent-sage)]/10 to-transparent blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-gradient-to-br from-[var(--accent-lavender)]/8 to-transparent blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center justify-center pt-8 pb-16">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary-terracotta)]/10 text-[var(--primary-terracotta)] text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              {t("trustedBy")}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-[var(--text-primary)] leading-[1.1] tracking-tight mb-8"
          >
            {t("title")}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl lg:text-2xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed mb-12"
          >
            {t("subtitle")}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/auth/signup"
              onClick={() => trackCTAClick("hero_get_started")}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-[var(--primary-terracotta)] to-[var(--primary-clay)] rounded-full shadow-lg shadow-[var(--primary-terracotta)]/25 hover:shadow-xl hover:shadow-[var(--primary-terracotta)]/30 transition-all duration-300 hover:scale-105"
            >
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative">{t("getStarted")}</span>
            </Link>
            <Link
              href="/auth/login"
              onClick={() => trackCTAClick("hero_sign_in")}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-[var(--primary-terracotta)] bg-white/80 backdrop-blur-sm border-2 border-[var(--primary-terracotta)]/20 rounded-full hover:border-[var(--primary-terracotta)]/40 hover:bg-white transition-all duration-300"
            >
              {t("signIn")}
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg-cream)] to-transparent pointer-events-none" />
    </section>
  );
}
