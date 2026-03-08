"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

export function FAQSection() {
  const t = useTranslations("marketing.faq");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { q: "q1", a: "a1" },
    { q: "q2", a: "a2" },
    { q: "q3", a: "a3" },
    { q: "q4", a: "a4" },
    { q: "q5", a: "a5" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: t(faq.q),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(faq.a),
      },
    })),
  };

  return (
    <section className="py-24 md:py-32 px-4 bg-[#F9F7F4]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
       <div className="max-w-3xl mx-auto">
          <motion.h2 
             className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#2B241B] mb-16 leading-[1.1] tracking-tight"
          >
            {t("title")}
          </motion.h2>
          <div className="space-y-0 border-t border-[#D4C5B0]/50">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={faq.q} className="border-b border-[#D4C5B0]/50 overflow-hidden">
                   <button
                     onClick={() => setOpenIndex(isOpen ? null : index)}
                     className="w-full py-8 text-left flex items-start justify-between hover:text-[var(--primary-terracotta)] transition-colors group"
                   >
                     <span className="font-serif text-xl md:text-2xl text-[#2B241B] pr-8 group-hover:text-[var(--primary-terracotta)] transition-colors">
                       {t(faq.q)}
                     </span>
                     <motion.span 
                       animate={{ rotate: isOpen ? 45 : 0 }}
                       className="text-[#8B7355] text-3xl font-light mt-[-4px]"
                     >
                       +
                     </motion.span>
                   </button>
                   <AnimatePresence>
                     {isOpen && (
                       <motion.div 
                         initial={{ height: 0, opacity: 0 }}
                         animate={{ height: "auto", opacity: 1 }}
                         exit={{ height: 0, opacity: 0 }}
                         transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                       >
                         <div className="pb-8 pr-12">
                           <p className="text-lg text-[#5A4A3A] leading-relaxed font-sans">{t(faq.a)}</p>
                         </div>
                       </motion.div>
                     )}
                   </AnimatePresence>
                </div>
              );
            })}
          </div>
       </div>
    </section>
  );
}
