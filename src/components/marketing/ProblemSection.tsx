"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useScrollAnimation } from "@/components/ui/useScrollAnimation";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { Brain, BookOpen, Clock } from "lucide-react";
import { containerVariants, itemVariants } from "@/components/ui/animations";

export function ProblemSection() {
  const t = useTranslations("marketing.problem");
  const { ref, isInView } = useScrollAnimation();

  const points = [
    { icon: <Brain className="w-8 h-8" />, text: t("point1") },
    { icon: <BookOpen className="w-8 h-8" />, text: t("point2") },
    { icon: <Clock className="w-8 h-8" />, text: t("point3") },
  ];

  return (
    <section className="py-20 px-4 bg-white" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="font-serif text-4xl md:text-5xl font-bold text-[var(--text-primary)] text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {t("title")}
        </motion.h2>
        <motion.p
          className="text-xl text-[var(--text-secondary)] text-center mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {t("description")}
        </motion.p>
        <motion.div
          className="grid md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {points.map((point, index) => (
            <motion.div key={index} variants={itemVariants}>
              <AnimatedCard className="text-center p-8">
                <motion.div
                  className="text-[var(--primary-terracotta)] mb-4 flex justify-center"
                  animate={isInView ? { rotate: [0, 10, -10, 0] } : {}}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                >
                  {point.icon}
                </motion.div>
                <p className="font-medium text-[var(--text-primary)]">{point.text}</p>
              </AnimatedCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
