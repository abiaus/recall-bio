"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Mic, Heart, Shield, Award, Compass, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ExhibitionHall {
  number: string;
  roomName: string;
  headline: string;
  description: string;
  accentBg: string;
  quote: string;
}

const EXHIBITION_HALLS: ExhibitionHall[] = [
  {
    number: "SALA I",
    roomName: "La Preservación de la Voz Human",
    headline: "Un segundo de voz guarda más emoción que mil páginas de texto.",
    description:
      "El tono, la risa, las pausas y los suspiros son la verdadera huella digital de quienes amamos. En Recall.bio, la voz es la protagonista sagrada.",
    accentBg: "bg-[#9E5D46]",
    quote: "La voz es el puente más corto entre dos corazones a través del tiempo.",
  },
  {
    number: "SALA II",
    roomName: "El Ritual Diario de Reflexión",
    headline: "Sin bloqueos. Una pregunta inspiradora cada mañana.",
    description:
      "Olvídate de la página en blanco. Cada día recibes una consigna escrita para tu etapa de vida. Solo presionas un botón, hablas y tu memoria se archiva sola.",
    accentBg: "bg-[#9CAF88]",
    quote: "Cinco minutos al día construyen el archivo de toda una vida.",
  },
  {
    number: "SALA III",
    roomName: "La Custodia & Bóveda de Herederos",
    headline: "Tus historias entregadas exactamente a quienes tú elijas.",
    description:
      "Tus recuerdos no quedan flotando en internet. Tú defines quién los recibe, cuándo se desbloquean y bajo qué reglas de privacidad.",
    accentBg: "bg-[#B8A9C9]",
    quote: "Tu legado no es lo que dejas al azar, sino lo que proteges con amor.",
  },
];

export function V3ExhibitionScroll() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <section ref={containerRef} className="py-24 bg-[#FDF8F3] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F7EDE4] text-[#3D3229] text-xs font-semibold uppercase tracking-widest">
            <Compass className="w-3.5 h-3.5 text-[#9E5D46]" /> Recorrido Guiado por las Salas
          </span>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-semibold text-[#3D3229] tracking-tight">
            Las 3 Salas del Museo de Legado
          </h2>

          <p className="font-sans text-base sm:text-lg text-[#6B5D4D] leading-relaxed">
            Avanza a través de las galerías para comprender cómo Recall.bio transforma momentos cotidianos en patrimonio emocional.
          </p>
        </div>

        {/* Exhibition Halls List */}
        <div className="mt-16 space-y-16 max-w-5xl mx-auto">
          {EXHIBITION_HALLS.map((hall, idx) => (
            <motion.div
              key={hall.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="bg-white rounded-[40px] p-8 sm:p-12 border border-[#F7EDE4] shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center group hover:shadow-2xl transition-all duration-500"
            >
              {/* Room Number & Badge */}
              <div className="lg:col-span-4 space-y-4">
                <div className={`w-14 h-14 rounded-2xl ${hall.accentBg} text-white font-serif font-bold text-xl flex items-center justify-center shadow-md`}>
                  {hall.number}
                </div>
                <h3 className="font-serif text-sm uppercase tracking-widest text-[#9B8B7A] font-semibold">
                  {hall.roomName}
                </h3>
                <p className="font-serif text-lg italic text-[#9E5D46]">
                  "{hall.quote}"
                </p>
              </div>

              {/* Main Hall Narrative */}
              <div className="lg:col-span-8 space-y-4 lg:border-l lg:border-[#F7EDE4] lg:pl-8">
                <h4 className="font-serif text-2xl sm:text-3xl font-semibold text-[#3D3229] leading-snug">
                  {hall.headline}
                </h4>
                <p className="font-sans text-base sm:text-lg text-[#6B5D4D] leading-relaxed">
                  {hall.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
