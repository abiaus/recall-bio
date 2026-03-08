"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useScrollAnimation } from "@/components/ui/useScrollAnimation";
import { Brain, BookOpen, Clock } from "lucide-react";
import { containerVariants } from "@/components/ui/animations";

export function ProblemSection() {
  const t = useTranslations("marketing.problem");
  const { ref, isInView } = useScrollAnimation();

  const points = [
    { icon: <Brain className="w-6 h-6" />, text: t("point1") },
    { icon: <BookOpen className="w-6 h-6" />, text: t("point2") },
    { icon: <Clock className="w-6 h-6" />, text: t("point3") },
  ];

  return (
    <section className="py-24 md:py-32 px-4 bg-[#F9F7F4] relative overflow-hidden" ref={ref}>
      {/* Subtle organic background element */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-[var(--primary-clay)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

      <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-12 lg:gap-24 items-start relative z-10">
        <motion.div
          className="md:col-span-5 md:sticky md:top-32"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
        >
          <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-[#2B241B] leading-[1.1] mb-6 tracking-tight">
            {t("title")}
          </h2>
          <p className="text-xl text-[#5A4A3A] leading-relaxed max-w-md">
            {t("description")}
          </p>
        </motion.div>

        <motion.div
          className="md:col-span-7 flex flex-col pt-8 md:pt-0"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {points.map((point, index) => (
            <motion.div 
              key={index} 
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] } }
              }}
              className={`flex items-start gap-6 md:gap-8 py-10 border-b border-[#D4C5B0]/40 group ${index === 0 ? "border-t" : ""}`}
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full border border-[#D4C5B0] flex items-center justify-center text-[var(--primary-terracotta)] group-hover:bg-[var(--primary-terracotta)] group-hover:text-white group-hover:border-[var(--primary-terracotta)] transition-all duration-500 ease-out mt-1">
                <motion.div
                  whileHover={{ rotate: [-5, 5, -5, 0] }}
                  transition={{ duration: 0.4 }}
                >
                  {point.icon}
                </motion.div>
              </div>
              <div>
                <p className="font-serif text-3xl md:text-4xl text-[#2B241B] font-medium leading-snug group-hover:text-[var(--primary-terracotta)] transition-colors duration-500">
                  {point.text}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
