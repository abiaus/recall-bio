"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { trackCTAClick } from "@/lib/analytics";
import { useScrollAnimation } from "@/components/ui/useScrollAnimation";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  const t = useTranslations("marketing.cta");
  const { ref, isInView } = useScrollAnimation();

  return (
    <section className="py-32 md:py-48 px-4 bg-[#2B241B] relative overflow-hidden" ref={ref}>
      <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
        <motion.h2
          className="font-serif text-5xl md:text-6xl lg:text-[5rem] font-bold text-[#F6F1E7] leading-[0.9] tracking-tight mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
        >
          {t("title")}
        </motion.h2>
        
        <motion.p
          className="text-xl md:text-3xl font-serif italic text-[#D4C5B0] max-w-2xl mx-auto mb-16 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {t("subtitle")}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link 
            href="/auth/signup" 
            onClick={() => trackCTAClick("cta_final")}
            className="group relative inline-flex items-center justify-center gap-4 px-10 py-5 text-xl font-medium text-[#2B241B] bg-[#F6F1E7] overflow-hidden rounded-full hover:scale-[1.02] transition-transform duration-500 ease-out"
          >
            <span className="absolute inset-0 w-full h-full bg-[var(--primary-terracotta)] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            <span className="relative z-10 group-hover:text-white transition-colors duration-500">{t("getStarted")}</span>
            <ArrowRight className="relative z-10 w-6 h-6 group-hover:translate-x-2 group-hover:text-white transition-all duration-500" />
          </Link>
        </motion.div>
        
        <motion.p
          className="text-sm tracking-widest uppercase text-[#8B7355] mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {t("noCreditCard")}
        </motion.p>
      </div>
    </section>
  );
}
