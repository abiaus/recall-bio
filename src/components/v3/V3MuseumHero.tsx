"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, Pause, Sparkles, Mic, Volume2, Shield, ArrowDown, Compass } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export function V3MuseumHero() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlayingHeroVoice, setIsPlayingHeroVoice] = useState(false);
  const [activeVoiceIndex, setActiveVoiceIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const voices = [
    {
      title: "La tarde de 1984 cuando nació la música",
      speaker: "Roberto M. (Papá)",
      year: "1984",
      audioDuration: "0:45",
      transcript:
        "Cuando afinamos la primera cuerda y miré a tu madre entre el público, supe que ese instante duraría toda la vida.",
    },
    {
      title: "El verdadero valor del coraje en la tormenta",
      speaker: "Elena R. (Mamá)",
      year: "1998",
      audioDuration: "0:38",
      transcript:
        "Los días oscuros solo están preparando el terreno para lo que florecerá después. No tengas miedo de empezar de nuevo.",
    },
  ];

  const currentVoice = voices[activeVoiceIndex];

  return (
    <section
      ref={containerRef}
      className="relative min-h-[90vh] flex items-center justify-center pt-12 pb-24 bg-[#FDF8F3] overflow-hidden"
    >
      {/* Background Subtle Museum Light Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[85%] max-w-6xl h-[550px] bg-gradient-to-b from-[#F7EDE4]/80 via-[#FDF8F3] to-transparent rounded-[64px] blur-3xl -z-10 pointer-events-none" />

      <motion.div
        style={{ scale: heroScale, opacity: heroOpacity, y: yParallax }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Narrative Column */}
          <div className="lg:col-span-6 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F7EDE4] border border-[#E8EDE5]">
              <Compass className="w-4 h-4 text-[#9E5D46]" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[#3D3229]">
                Exhibición de Legado Humano • Museo Digital
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-semibold text-[#3D3229] leading-[1.1] tracking-tight">
              Donde cada voz se convierte en una obra de arte eterna.
            </h1>

            <p className="font-sans text-lg sm:text-xl text-[#6B5D4D] leading-relaxed max-w-xl">
              Recall.bio es el museo privado de tu familia. Un espacio ceremonial para registrar tu vida mediante preguntas diarias, voz auténtica y custodia segura para quienes vendrán después.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/es/auth/signup"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#9E5D46] hover:bg-[#854B36] text-white font-semibold text-base transition-all shadow-md hover:shadow-xl active:scale-95 group"
              >
                <Mic className="w-5 h-5 text-amber-200" />
                <span>Ingresar al Museo</span>
              </Link>

              <a
                href="#cerrojo-boveda"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[#F7EDE4] hover:bg-[#E8EDE5] text-[#3D3229] font-medium text-base transition-colors"
              >
                <Sparkles className="w-4 h-4 text-[#9E5D46]" />
                <span>Probar Cerrojo de Bóveda</span>
              </a>
            </div>

            {/* Curatorial Badge */}
            <div className="pt-6 border-t border-[#F7EDE4] flex items-center gap-6 text-xs text-[#6B5D4D]">
              <div>
                <strong className="block text-[#3D3229] font-serif text-base">100% Privado</strong>
                <span>Custodia encriptada RLS</span>
              </div>
              <div className="h-8 w-px bg-[#F7EDE4]" />
              <div>
                <strong className="block text-[#3D3229] font-serif text-base">Gemini IA</strong>
                <span>Transcripción sónica precisa</span>
              </div>
            </div>
          </div>

          {/* Right Museum Exhibit Frame */}
          <div className="lg:col-span-6">
            <div className="relative bg-white rounded-[40px] p-8 border border-[#F7EDE4] shadow-2xl space-y-6 group hover:shadow-3xl transition-all duration-500">
              
              {/* Exhibit Label Tag */}
              <div className="flex items-center justify-between border-b border-[#F7EDE4] pb-4">
                <span className="text-xs font-mono text-[#9B8B7A] tracking-wider uppercase">
                  Pieza de Archivo #042 • Año {currentVoice.year}
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#9CAF88]/20 text-[#3D3229]">
                  Voz Original
                </span>
              </div>

              {/* Exhibit Main Title */}
              <h3 className="font-serif font-semibold text-2xl sm:text-3xl text-[#3D3229] leading-snug">
                "{currentVoice.title}"
              </h3>

              <p className="text-xs font-medium text-[#6B5D4D]">
                Voz de <strong className="text-[#3D3229]">{currentVoice.speaker}</strong>
              </p>

              {/* Soundscape Interactive Player */}
              <div className="p-6 rounded-3xl bg-[#FDF8F3] border border-[#F7EDE4] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#9E5D46] text-white flex items-center justify-center">
                      <Volume2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#3D3229]">
                        Grabación de Voz de Alta Fidelidad
                      </h4>
                      <p className="text-xs text-[#9B8B7A]">Duración: {currentVoice.audioDuration}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsPlayingHeroVoice(!isPlayingHeroVoice)}
                    className="w-12 h-12 rounded-2xl bg-[#3D3229] hover:bg-[#9E5D46] text-white flex items-center justify-center shadow-md active:scale-95 transition-all"
                  >
                    {isPlayingHeroVoice ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                  </button>
                </div>

                {/* Animated Audio Waveform */}
                <div className="h-14 flex items-end gap-1.5 px-3 py-1.5 bg-white rounded-2xl border border-[#F7EDE4]">
                  {[35, 70, 95, 45, 80, 100, 60, 85, 40, 90, 75, 50, 95, 65, 40, 85, 70, 45, 90, 60].map((h, idx) => (
                    <div
                      key={idx}
                      className="flex-1 rounded-full transition-all duration-300"
                      style={{
                        height: isPlayingHeroVoice ? `${Math.min(100, Math.max(20, h * (0.6 + Math.random() * 0.7)))}%` : `${h * 0.35}%`,
                        backgroundColor: isPlayingHeroVoice ? "#9E5D46" : "#E8EDE5",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Transcript Box */}
              <div className="p-5 rounded-2xl bg-[#3D3229] text-[#FDF8F3] space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-200">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Transcripción de Archivo</span>
                </div>
                <p className="font-sans text-sm italic text-amber-50/90 leading-relaxed">
                  "{currentVoice.transcript}"
                </p>
              </div>

            </div>
          </div>

        </div>
      </motion.div>
    </section>
  );
}
