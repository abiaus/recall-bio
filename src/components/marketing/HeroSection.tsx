"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { trackCTAClick } from "@/lib/analytics";
import { MarketingHeader } from "./MarketingHeader";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  const t = useTranslations("marketing.hero");

  return (
    <section className="relative min-h-[100vh] flex flex-col px-4 pt-0 overflow-hidden bg-[var(--bg-cream)]">
      <MarketingHeader />

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-between pt-8 pb-16 px-4 sm:px-12 md:px-24 max-w-7xl mx-auto w-full gap-16">
        <div className="max-w-3xl text-left flex-1">
          {/* Subtle Decorative Line */}
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 40 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8 border-t border-[var(--primary-clay)]"
          />

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] text-[var(--text-primary)] leading-[1.05] tracking-tight mb-10"
          >
            {t("title")}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl lg:text-2xl text-[var(--text-secondary)] max-w-2xl leading-relaxed mb-14"
          >
            {t("subtitle")}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-6 items-start"
          >
            <Link
              href="/auth/signup"
              onClick={() => trackCTAClick("hero_get_started")}
              className="group inline-flex items-center justify-center px-10 py-4 text-base tracking-wide font-medium text-white bg-[var(--text-primary)] hover:bg-[var(--text-secondary)] transition-colors duration-300"
            >
              {t("getStarted")}
              <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 w-0 overflow-hidden group-hover:w-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out" />
            </Link>
            <Link
              href="/auth/login"
              onClick={() => trackCTAClick("hero_sign_in")}
              className="inline-flex items-center justify-center px-10 py-4 text-base tracking-wide font-medium text-[var(--text-primary)] border border-[#D4C5B0] bg-transparent hover:border-[var(--text-primary)] hover:bg-white hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
            >
              {t("signIn")}
            </Link>
          </motion.div>
        </div>

        {/* The Memory Stack */}
        <div className="flex-1 w-full max-w-lg hidden lg:block relative h-[500px] perspective-[1000px]">
          {/* Card 3 (Bottom) */}
          <motion.div
            initial={{ opacity: 0, y: 40, rotateX: 10, rotateZ: -4 }}
            animate={{
              opacity: 0.6,
              y: [40, 36, 40],
              rotateX: [10, 10.5, 10],
              rotateZ: [-4, -3.5, -4]
            }}
            transition={{
              opacity: { duration: 1.5, delay: 0.7, ease: [0.16, 1, 0.3, 1] },
              default: { duration: 12, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: 1.7 }
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-96 bg-white border border-[#D4C5B0]/30 shadow-md p-8 flex flex-col justify-between"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          >
            <div className="space-y-4">
              <div className="w-12 h-1 bg-[#D4C5B0]/40 rounded-full" />
              <div className="w-full h-2 bg-[var(--bg-warm)] rounded-full" />
              <div className="w-5/6 h-2 bg-[var(--bg-warm)] rounded-full" />
              <div className="w-4/6 h-2 bg-[var(--bg-warm)] rounded-full" />
            </div>
            <div className="w-24 h-24 bg-[var(--bg-warm)] rounded-sm mt-auto" />
          </motion.div>

          {/* Card 2 (Middle) */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotateX: 5, rotateZ: 2 }}
            animate={{
              opacity: 0.85,
              y: [0, -4, 0],
              rotateX: [5, 5.5, 5],
              rotateZ: [2, 1.5, 2]
            }}
            transition={{
              opacity: { duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] },
              default: { duration: 14, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: 1.5 }
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-96 bg-white border border-[#D4C5B0]/40 shadow-xl p-8 flex flex-col justify-between"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          >
            <div className="space-y-4">
              <p className="font-serif text-sm text-[var(--text-secondary)] italic">
                &ldquo;{t("stackSmellQuestion")}&rdquo;
              </p>
              <div className="w-full h-8 bg-gradient-to-r from-[var(--primary-clay)]/20 to-transparent rounded-sm flex items-center px-4">
                <div className="h-0.5 bg-[var(--primary-clay)] w-1/3" />
              </div>
            </div>
            <div className="mt-auto border-t border-[#D4C5B0]/30 pt-4 flex justify-between items-center text-xs text-[var(--text-muted)] font-medium">
              <span>{t("stackDate")}</span>
              <span>2:15</span>
            </div>
          </motion.div>

          {/* Card 1 (Top) - Separated hover and continuous animation layers */}
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: -50 }}
            transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{
              scale: 1.02,
              y: -58,
              transition: { duration: 0.5, ease: "easeOut" }
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
          >
            <motion.div
              animate={{
                y: [0, -4, 0],
                rotateX: [0, -1, 0],
                rotateZ: [-1, -0.5, -1]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
                delay: 1.3
              }}
              className="w-80 h-auto min-h-[20rem] bg-[#FDF8F3] border border-[#D4C5B0]/50 shadow-2xl p-8 flex flex-col justify-between cursor-default transition-shadow hover:shadow-3xl"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            >
              <div className="space-y-4">
                <p className="font-serif text-sm text-[var(--text-secondary)] italic border-b border-[#D4C5B0]/30 pb-4 mb-4">
                  &ldquo;{t("stackAdviceQuestion")}&rdquo;
                </p>
                <p className="text-[var(--text-primary)] text-sm leading-relaxed">
                  {t("stackAdviceAnswer")}
                </p>
              </div>
              <div className="mt-8 pt-4 flex justify-between items-center text-xs text-[var(--text-muted)] font-medium">
                <span>{t("stackToday")}</span>
                <span>{t("stackTextEntry")}</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
