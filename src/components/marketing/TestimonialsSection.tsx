"use client";

import { useTranslations } from "next-intl";

export function TestimonialsSection() {
  const t = useTranslations("marketing.testimonials");

  const testimonials = [
    { key: "testimonial1" },
    { key: "testimonial2" },
    { key: "testimonial3" },
  ];

  return (
    <section className="py-20 px-4 bg-[#F6F1E7]">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#2B241B] text-center mb-16">
          {t("title")}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.key}
              className="bg-white rounded-2xl p-8 shadow-sm border border-[#D4C5B0]/30"
            >
              <div className="text-4xl mb-4">💬</div>
              <p className="text-[#5A4A3A] mb-6 italic leading-relaxed">
                "{t(`${testimonial.key}.quote`)}"
              </p>
              <div className="border-t border-[#D4C5B0]/30 pt-4">
                <p className="font-semibold text-[#2B241B]">
                  {t(`${testimonial.key}.author`)}
                </p>
                <p className="text-sm text-[#5A4A3A]">
                  {t(`${testimonial.key}.role`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
