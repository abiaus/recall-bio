"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useScrollAnimation } from "@/components/ui/useScrollAnimation";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { containerVariants, itemVariants } from "@/components/ui/animations";

export function HowItWorksSection() {
  const t = useTranslations("marketing.howItWorks");
  const { ref, isInView } = useScrollAnimation();

  const steps = [
    { key: "step1", number: "1" },
    { key: "step2", number: "2" },
    { key: "step3", number: "3" },
    { key: "step4", number: "4" },
  ];

  return (
    <section className="py-20 px-4 bg-white" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="font-serif text-4xl md:text-5xl font-bold text-[var(--text-primary)] text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {t("title")}
        </motion.h2>
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {steps.map((step, index) => (
            <motion.div key={step.key} className="relative" variants={itemVariants}>
              <motion.div
                className="absolute -top-4 -left-4 w-14 h-14 rounded-full bg-gradient-to-br from-[var(--primary-terracotta)] to-[var(--accent-sage)] text-white flex items-center justify-center font-bold text-xl shadow-lg z-10"
                animate={isInView ? { scale: [0, 1.2, 1], rotate: [0, 360] } : {}}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                {step.number}
              </motion.div>
              <AnimatedCard className="p-6 pt-12 h-full">
                <h3 className="font-serif text-xl font-semibold text-[var(--text-primary)] mb-3">
                  {t(`${step.key}.title`)}
                </h3>
                <p className="text-[var(--text-secondary)]">{t(`${step.key}.description`)}</p>
              </AnimatedCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
