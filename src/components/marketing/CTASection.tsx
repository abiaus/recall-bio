"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { trackCTAClick } from "@/lib/analytics";
import { useScrollAnimation } from "@/components/ui/useScrollAnimation";
import { ArrowRight, Heart } from "lucide-react";

export function CTASection() {
  const t = useTranslations("marketing.cta");
  const { ref, isInView } = useScrollAnimation();

  return (
    <section
      className="relative py-24 md:py-32 px-4 overflow-hidden"
      ref={ref}
    >
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-terracotta)] via-[var(--primary-clay)] to-[var(--primary-earth)]" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full bg-white/5 blur-3xl" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm mb-6">
            <Heart className="w-8 h-8 text-white" />
          </span>
        </motion.div>

        <motion.h2
          className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {t("title")}
        </motion.h2>
        
        <motion.p
          className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {t("subtitle")}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link 
            href="/auth/signup" 
            onClick={() => trackCTAClick("cta_final")}
            className="group inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-[var(--primary-terracotta)] bg-white rounded-full shadow-xl shadow-black/10 hover:shadow-2xl hover:shadow-black/15 transition-all duration-300 hover:scale-105"
          >
            {t("getStarted")}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
        
        <motion.p
          className="text-sm text-white/60 mt-6"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {t("noCreditCard")}
        </motion.p>
      </div>
    </section>
  );
}
