"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

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
    <section className="py-20 px-4 bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto">
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#2B241B] text-center mb-16">
          {t("title")}
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.q}
              className="border border-[#D4C5B0]/30 rounded-lg overflow-hidden bg-[#F6F1E7]/30"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-[#F6F1E7]/50 transition-colors"
              >
                <span className="font-semibold text-[#2B241B] pr-4">
                  {t(faq.q)}
                </span>
                <span className="text-[#8B7355] text-xl flex-shrink-0">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-[#5A4A3A] leading-relaxed">{t(faq.a)}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
