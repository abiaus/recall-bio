"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export function TestimonialsSection() {
  const t = useTranslations("marketing.testimonials");

  const testimonials = [
    { key: "testimonial1" },
    { key: "testimonial2" },
    { key: "testimonial3" },
  ];

  return (
    <section className="py-24 md:py-32 px-4 bg-[#F6F1E7]">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#2B241B] text-center mb-20 leading-[1.1] tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
        >
          {t("title")}
        </motion.h2>

        <div className="flex flex-col gap-16">
          {/* Primary Testimonial (Large) */}
          <motion.div 
            className="bg-white/50 backdrop-blur-sm rounded-3xl p-10 md:p-16 shadow-none border border-[#D4C5B0]/30 hover:bg-white hover:border-[#D4C5B0]/60 hover:shadow-xl transition-all duration-500 ease-out group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-[var(--primary-clay)]/40 font-serif text-[8rem] leading-none absolute -top-6 -left-2 select-none group-hover:text-[var(--primary-terracotta)]/20 transition-colors duration-500">
              "
            </div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <p className="font-serif text-2xl md:text-4xl text-[#2B241B] leading-relaxed md:leading-snug mb-8 max-w-4xl mx-auto">
                {t(`${testimonials[0].key}.quote`)}
              </p>
              <div className="flex flex-col items-center">
                <p className="font-semibold text-lg text-[#2B241B] uppercase tracking-wider mb-1">
                  {t(`${testimonials[0].key}.author`)}
                </p>
                <p className="text-[#8B7355] italic font-serif text-lg">
                  {t(`${testimonials[0].key}.role`)}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Secondary Testimonials */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {testimonials.slice(1).map((testimonial, i) => (
              <motion.div 
                key={testimonial.key}
                className="p-8 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
              >
                 <hr className="w-12 border-[#D4C5B0] mb-8 group-hover:w-24 group-hover:border-[var(--primary-terracotta)] transition-all duration-500" />
                 <p className="text-xl md:text-2xl text-[#5A4A3A] italic font-serif leading-relaxed mb-8">
                  "{t(`${testimonial.key}.quote`)}"
                 </p>
                 <div>
                  <p className="font-semibold text-[#2B241B]">
                    {t(`${testimonial.key}.author`)}
                  </p>
                  <p className="text-sm text-[#8B7355]">
                    {t(`${testimonial.key}.role`)}
                  </p>
                 </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
