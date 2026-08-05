"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Clock, Compass, Shield } from "lucide-react";

interface GenerationMilestone {
  id: string;
  timeframe: string;
  targetAudience: string;
  headline: string;
  story: string;
  iconBg: string;
}

const MILESTONES: GenerationMilestone[] = [
  {
    id: "hoy",
    timeframe: "Hoy",
    targetAudience: "Tú (Presente)",
    headline: "Un ritual diario de 5 minutos que trae paz y claridad.",
    story:
      "Respondes la pregunta del día con tu voz. Organizar tus memorias te conecta con tus valores fundamentales y te permite celebrar cada capítulo de tu viaje.",
    iconBg: "bg-[#9E5D46] text-white",
  },
  {
    id: "20-anios",
    timeframe: "En 20 Años",
    targetAudience: "Tus Hijos",
    headline: "Escuchar tu voz cuando enfrenten sus propias decisiones de vida.",
    story:
      "Tus hijos abren su cápsula y escuchan tus consejos grabados cuando eran jóvenes. Tu tono de voz, tus pausas y tu calidez están ahí para guiarlos cuando más te necesitan.",
    iconBg: "bg-[#9CAF88] text-white",
  },
  {
    id: "50-anios",
    timeframe: "En 50 Años",
    targetAudience: "Tus Nietos",
    headline: "Conocer la risa y la historia real de sus abuelos.",
    story:
      "Tus nietos no solo leen nombres en una lista genealógica. Escuchan tus anécdotas en primera persona, ven tus fotos originales y comprenden de dónde vienen sus gestos.",
    iconBg: "bg-[#B8A9C9] text-[#3D3229]",
  },
  {
    id: "80-anios",
    timeframe: "En 80 Años",
    targetAudience: "Tus Bisnietos",
    headline: "Un legado familiar vivo que trasciende el olvido digital.",
    story:
      "Mientras otros archivos digitales se pierden en discos obsoletos, tu boveda en Recall.bio preserva tu archivo emocional legible e intacto a través del tiempo.",
    iconBg: "bg-[#D4A5A5] text-[#3D3229]",
  },
];

export function V3GenerationalImpact() {
  const [selectedIndex, setSelectedIndex] = useState(1);
  const activeMilestone = MILESTONES[selectedIndex];

  return (
    <section className="py-20 bg-[#FDF8F3] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#3D3229] tracking-tight">
            Un Legado que Resuena en 3 Generaciones
          </h2>
          <p className="font-sans text-base sm:text-lg text-[#6B5D4D] leading-relaxed">
            Las fotos impresas se descoloran y los mensajes de texto se pierden. Tu voz e historias habladas perduran para siempre.
          </p>
        </div>

        {/* Timeline Interactive Selector */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-2 bg-[#F7EDE4] rounded-2xl">
            {MILESTONES.map((m, idx) => (
              <button
                key={m.id}
                onClick={() => setSelectedIndex(idx)}
                className={`py-3 px-4 rounded-xl text-center transition-all ${
                  idx === selectedIndex
                    ? "bg-white text-[#3D3229] font-bold shadow-sm"
                    : "text-[#6B5D4D] hover:text-[#3D3229] font-medium"
                }`}
              >
                <span className="block text-xs uppercase tracking-wider text-[#9B8B7A]">
                  {m.targetAudience}
                </span>
                <span className="font-serif text-sm sm:text-base mt-0.5 block">
                  {m.timeframe}
                </span>
              </button>
            ))}
          </div>

          {/* Active Milestone Card */}
          <div className="mt-8 bg-white rounded-[32px] p-8 sm:p-10 border border-[#F7EDE4] shadow-xl text-center space-y-4">
            <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center font-bold text-lg ${activeMilestone.iconBg}`}>
              <Clock className="w-7 h-7" />
            </div>

            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#9E5D46] bg-[#9E5D46]/10 px-3 py-1 rounded-full">
              {activeMilestone.targetAudience}
            </span>

            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#3D3229] max-w-2xl mx-auto leading-snug">
              "{activeMilestone.headline}"
            </h3>

            <p className="font-sans text-base sm:text-lg text-[#6B5D4D] max-w-2xl mx-auto leading-relaxed">
              {activeMilestone.story}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
