"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useScrollAnimation } from "@/components/ui/useScrollAnimation";

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
    <section className="py-24 md:py-32 px-4 bg-white relative overflow-hidden" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#2B241B] text-center mb-24 leading-[1.1] tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
        >
          {t("title")}
        </motion.h2>

        <div className="relative">
          {/* Vertical line connecting steps */}
          <div className="absolute left-[24px] md:left-1/2 top-4 bottom-4 w-px bg-[#D4C5B0]/40 -translate-x-1/2" />
          
          <motion.div 
            className="absolute left-[24px] md:left-1/2 top-4 bottom-4 w-px bg-[var(--primary-terracotta)] -translate-x-1/2 origin-top"
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 2, ease: "easeInOut" }}
          />

          <div className="space-y-16 md:space-y-0 relative">
             {steps.map((step, index) => {
                const isOdd = index % 2 === 0;
                return (
                   <motion.div 
                     key={step.key}
                     className="relative flex items-center md:h-64"
                     initial={{ opacity: 0, y: 30 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true, margin: "-100px" }}
                     transition={{ duration: 0.7, delay: index * 0.1 }}
                   >
                      {/* Center point */}
                      <div className="absolute left-[24px] md:left-1/2 w-12 h-12 bg-white rounded-full border border-[#D4C5B0] shadow-sm flex items-center justify-center -translate-x-1/2 top-0 md:top-1/2 md:-translate-y-1/2 z-10 transition-colors duration-500 hover:border-[var(--primary-terracotta)] hover:text-[var(--primary-terracotta)] hover:shadow-md cursor-default">
                         <span className="font-serif text-xl text-[var(--primary-terracotta)] font-medium">{step.number}</span>
                      </div>
                      
                      <div className={`w-full md:w-1/2 pl-16 md:pl-0 ${isOdd ? 'md:pr-16 md:text-right' : 'md:pl-16 md:ml-auto md:text-left'} pt-1 md:pt-0`}>
                         <div className="relative inline-block md:block">
                           <span className="text-[6rem] md:text-[8rem] font-serif font-bold text-[#F6F1E7] absolute -top-10 md:top-1/2 md:-translate-y-1/2 -z-10 leading-none select-none left-0 md:left-auto md:right-0 lg:opacity-100 opacity-70">
                              0{step.number}
                           </span>
                           <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#2B241B] mb-4 relative z-10">
                             {t(`${step.key}.title`)}
                           </h3>
                           <p className="text-[#5A4A3A] text-lg leading-relaxed md:max-w-sm inline-block relative z-10">
                             {t(`${step.key}.description`)}
                           </p>
                         </div>
                      </div>
                   </motion.div>
                )
             })}
          </div>
        </div>
      </div>
    </section>
  );
}
