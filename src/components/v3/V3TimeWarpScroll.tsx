"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Clock, Heart, Shield, ArrowDown } from "lucide-react";

interface WarpEra {
  year: string;
  label: string;
  audience: string;
  quote: string;
  speaker: string;
  bgGradient: string;
  borderColor: string;
}

const ERAS: WarpEra[] = [
  {
    year: "2026",
    label: "El Comienzo",
    audience: "Tú en el Presente",
    quote: "Un ritual diario de 5 minutos. Respondes una pregunta con tu voz y guardas tus fotos.",
    speaker: "Tus memorias registradas día a día",
    bgGradient: "from-[#FDF8F3] to-[#F7EDE4]",
    borderColor: "border-[#9E5D46]/30",
  },
  {
    year: "2046",
    label: "+20 Años",
    audience: "Tus Hijos",
    quote: "Tus hijos escuchan tus consejos grabados cuando enfrentan momentos clave en sus vidas.",
    speaker: "Cápsula de Sabiduría",
    bgGradient: "from-[#F7EDE4] to-[#E8EDE5]",
    borderColor: "border-[#9CAF88]/40",
  },
  {
    year: "2076",
    label: "+50 Años",
    audience: "Tus Nietos",
    quote: "Tus nietos escuchan la risa, el acento y la calidez de sus abuelos como si estuvieran ahí.",
    speaker: "Legado Familiar Vivo",
    bgGradient: "from-[#E8EDE5] to-[#F5E6E8]",
    borderColor: "border-[#B8A9C9]/40",
  },
  {
    year: "2106",
    label: "+80 Años",
    audience: "Tus Bisnietos",
    quote: "Tu voz e historias habladas perduran intactas mientras otros formatos digitales se apagan.",
    speaker: "Archivo Indestructible",
    bgGradient: "from-[#F5E6E8] to-[#FDF8F3]",
    borderColor: "border-[#D4A5A5]/40",
  },
];

export function V3TimeWarpScroll() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.02, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.4, 1, 1, 0.4]);

  return (
    <section ref={containerRef} className="py-24 bg-[#3D3229] text-[#FDF8F3] relative overflow-hidden">
      {/* Background Starfield Particles */}
      <div className="absolute inset-0 bg-[radial-gradient(#C4907C_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#9E5D46] text-white text-xs font-semibold uppercase tracking-widest">
            <Clock className="w-3.5 h-3.5" /> El Salto Temporal
          </span>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-tight">
            Viaja a través de 80 años de historia familiar.
          </h2>

          <p className="font-sans text-base sm:text-lg text-amber-100/80 leading-relaxed">
            Mira qué ocurre con tu archivo de voz a medida que el tiempo avanza.
          </p>
        </div>

        {/* Warp Eras Timeline Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ERAS.map((era, index) => (
            <motion.div
              key={era.year}
              style={{ scale, opacity }}
              className={`bg-white/10 backdrop-blur-xl rounded-[32px] p-7 border ${era.borderColor} shadow-2xl flex flex-col justify-between hover:bg-white/15 transition-all duration-300 group`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-3xl text-amber-200 group-hover:scale-110 transition-transform">
                    {era.year}
                  </span>
                  <span className="text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-white/10 text-amber-100">
                    {era.label}
                  </span>
                </div>

                <h3 className="font-serif font-semibold text-lg text-white mt-4">
                  {era.audience}
                </h3>

                <p className="font-sans text-sm text-amber-50/80 mt-3 leading-relaxed">
                  "{era.quote}"
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-amber-200/70">
                <span>{era.speaker}</span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
