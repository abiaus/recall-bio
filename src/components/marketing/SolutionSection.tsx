"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useScrollAnimation } from "@/components/ui/useScrollAnimation";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { HelpCircle, Mic, Users, Lock } from "lucide-react";
import { containerVariants, itemVariants } from "@/components/ui/animations";

export function SolutionSection() {
  const t = useTranslations("marketing.solution");
  const { ref, isInView } = useScrollAnimation();

  const features = [
    {
      key: "feature1",
      icon: <HelpCircle className="w-10 h-10" />,
    },
    {
      key: "feature2",
      icon: <Mic className="w-10 h-10" />,
    },
    {
      key: "feature3",
      icon: <Users className="w-10 h-10" />,
    },
    {
      key: "feature4",
      icon: <Lock className="w-10 h-10" />,
    },
  ];

  return (
    <section className="py-20 px-4" style={{ background: "var(--bg-warm)" }} ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="font-serif text-4xl md:text-5xl font-bold text-[var(--text-primary)] text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {t("title")}
        </motion.h2>
        <motion.p
          className="text-xl text-[var(--text-secondary)] text-center mb-16 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {t("description")}
        </motion.p>
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => (
            <motion.div key={feature.key} variants={itemVariants}>
              <AnimatedCard className="p-8 text-center">
                <motion.div
                  className="text-[var(--primary-terracotta)] mb-4 flex justify-center"
                  animate={isInView ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="font-serif text-xl font-semibold text-[var(--text-primary)] mb-3">
                  {t(`${feature.key}.title`)}
                </h3>
                <p className="text-[var(--text-secondary)]">
                  {t(`${feature.key}.description`)}
                </p>
              </AnimatedCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
