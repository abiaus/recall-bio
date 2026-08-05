"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Mic, Volume2, Sparkles, Shield, Heart, ArrowRight, UserCheck, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface SampleVoice {
  id: string;
  title: string;
  speaker: string;
  year: string;
  duration: string;
  mood: string;
  moodColor: string;
  transcript: string;
  audioFreqs: number[];
}

const SAMPLE_VOICES: SampleVoice[] = [
  {
    id: "papa-guitarra",
    title: "Mi primera guitarra y el concierto en Córdoba",
    speaker: "Roberto M. (Papá)",
    year: "1984",
    duration: "0:42",
    mood: "Nostálgico",
    moodColor: "bg-[#D4A5A5]/30 text-[#3D3229]",
    transcript:
      "Ahorré tres sueldos trabajando en el taller de mi tío para comprar esa vieja guitarra Criolla... Nadie creía que íbamos a llenar aquel teatro de barrio, pero cuando afinamos la primera cuerda y miré a tu madre entre el público, supe que ese instante duraría toda la vida.",
    audioFreqs: [25, 60, 85, 40, 95, 70, 30, 90, 50, 80, 100, 45, 65, 88, 30, 75, 95, 40, 60, 85, 35, 90, 55, 70],
  },
  {
    id: "mama-consejo",
    title: "El verdadero secreto para superar momentos difíciles",
    speaker: "Elena R. (Mamá)",
    year: "1998",
    duration: "0:38",
    mood: "Gratitud",
    moodColor: "bg-[#9CAF88]/30 text-[#3D3229]",
    transcript:
      "Hijita, cuando todo parezca incierto, recuerda que los días oscuros solo están preparando el terreno para lo que florecerá después. No tengas miedo de empezar de nuevo; el valor no es no sentir temor, sino caminar abrazada a él.",
    audioFreqs: [40, 75, 50, 90, 65, 30, 80, 100, 45, 70, 95, 60, 85, 40, 90, 70, 35, 80, 60, 95, 50, 75, 40, 65],
  },
  {
    id: "abuelo-receta",
    title: "La cocina de la abuela Carmela y la mudanza",
    speaker: "Don Mateo (Abuelo)",
    year: "1972",
    duration: "0:51",
    mood: "Contemplativo",
    moodColor: "bg-[#B8A9C9]/30 text-[#3D3229]",
    transcript:
      "En la vieja casa del campo, los domingos olían a albahaca fresca y pan casero horneado a leña. Esos almuerzos largos no eran solo comida; eran la excusa para escucharnos sin prisa, apretar las manos y recordar de dónde venimos.",
    audioFreqs: [30, 50, 80, 95, 40, 85, 60, 35, 90, 75, 50, 100, 65, 40, 80, 90, 55, 70, 45, 85, 60, 30, 90, 50],
  },
];

export function V3HeroVault() {
  const [activeVoice, setActiveVoice] = useState<SampleVoice>(SAMPLE_VOICES[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(15);
  const [transcribing, setTranscribing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 98) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1.5;
        });
      }, 300);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSelectVoice = (voice: SampleVoice) => {
    setActiveVoice(voice);
    setIsPlaying(true);
    setProgress(0);
    setTranscribing(true);
    setTimeout(() => setTranscribing(false), 600);
  };

  return (
    <section className="relative overflow-hidden pt-10 pb-20 md:pt-16 md:pb-28 bg-[#FDF8F3]">
      {/* Subtle organic background ambient blobs */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl h-[500px] bg-gradient-to-b from-[#F7EDE4]/60 via-[#FDF8F3] to-transparent rounded-[48px] -z-10 pointer-events-none blur-3xl opacity-70" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-6 space-y-8 text-left">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#3D3229] leading-[1.15] tracking-tight">
              La voz de quien amas jamás debería apagarse.
            </h1>

            <p className="font-sans text-lg sm:text-xl text-[#6B5D4D] leading-relaxed max-w-2xl">
              Recall.bio es la bóveda digital donde registras tu vida a través de preguntas diarias respondidas con tu voz, fotos y reflexiones. Preservado con IA y entregado con seguridad a tus herederos.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/es/auth/signup"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#9E5D46] hover:bg-[#854B36] text-white font-semibold text-base transition-all shadow-md hover:shadow-lg active:scale-95 group"
              >
                <Mic className="w-5 h-5 text-amber-200 group-hover:scale-110 transition-transform" />
                <span>Crear mi archivo de memoria</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#estudio"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[#F7EDE4] hover:bg-[#E8EDE5] text-[#3D3229] font-medium text-base transition-colors"
              >
                <Sparkles className="w-4 h-4 text-[#9E5D46]" />
                <span>Probar voz en vivo</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-[#F7EDE4] grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#9CAF88]/20 flex items-center justify-center text-[#3D3229]">
                  <Shield className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-[#6B5D4D]">Privacidad Total Supabase RLS</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#B8A9C9]/20 flex items-center justify-center text-[#3D3229]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-[#6B5D4D]">Transcripción Gemini IA</span>
              </div>

              <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
                <div className="w-8 h-8 rounded-full bg-[#D4A5A5]/20 flex items-center justify-center text-[#3D3229]">
                  <UserCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-[#6B5D4D]">Control de Herederos</span>
              </div>
            </div>
          </div>

          {/* Right Column: Heroic Interactive Soundscape Console */}
          <div className="lg:col-span-6">
            <div className="relative bg-white/90 backdrop-blur-xl rounded-[32px] p-6 sm:p-8 border border-[#F7EDE4] shadow-xl hover:shadow-2xl transition-all duration-500">
              
              {/* Header inside card */}
              <div className="flex items-center justify-between pb-6 border-b border-[#F7EDE4]">
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center justify-center">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping absolute opacity-75" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500 relative" />
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-lg text-[#3D3229]">
                      Consola de Voz & Legado
                    </h3>
                    <p className="text-xs text-[#9B8B7A]">Reproductor interactivo en vivo</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${activeVoice.moodColor}`}>
                  {activeVoice.mood}
                </span>
              </div>

              {/* Sample Selector Tabs */}
              <div className="mt-5 flex flex-wrap gap-2">
                {SAMPLE_VOICES.map((voice) => (
                  <button
                    key={voice.id}
                    onClick={() => handleSelectVoice(voice)}
                    className={`text-xs font-medium px-3 py-2 rounded-xl transition-all ${
                      activeVoice.id === voice.id
                        ? "bg-[#9E5D46] text-white shadow-sm"
                        : "bg-[#F7EDE4] text-[#6B5D4D] hover:bg-[#E8EDE5]"
                    }`}
                  >
                    {voice.speaker}
                  </button>
                ))}
              </div>

              {/* Active Audio Waveform & Controls Container */}
              <div className="mt-6 p-5 rounded-2xl bg-[#FDF8F3] border border-[#F7EDE4] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-base text-[#3D3229]">
                      "{activeVoice.title}"
                    </h4>
                    <p className="text-xs text-[#6B5D4D]">
                      {activeVoice.speaker} • Año {activeVoice.year}
                    </p>
                  </div>

                  <button
                    onClick={togglePlay}
                    className="w-13 h-13 rounded-2xl bg-[#9E5D46] hover:bg-[#854B36] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
                    aria-label={isPlaying ? "Pausar" : "Reproducir"}
                  >
                    {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                  </button>
                </div>

                {/* Animated Waveform Visualization */}
                <div className="h-16 flex items-end gap-1.5 px-2 py-1 bg-white/80 rounded-xl border border-[#F7EDE4]">
                  {activeVoice.audioFreqs.map((freq, i) => {
                    const isActive = (i / activeVoice.audioFreqs.length) * 100 <= progress;
                    const animatedHeight = isPlaying
                      ? Math.min(100, Math.max(20, (freq * (0.6 + Math.random() * 0.8))))
                      : freq * 0.5;

                    return (
                      <div
                        key={i}
                        className="flex-1 rounded-full transition-all duration-200"
                        style={{
                          height: `${animatedHeight}%`,
                          backgroundColor: isActive ? "#9E5D46" : "#E8EDE5",
                        }}
                      />
                    );
                  })}
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#F7EDE4] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#9E5D46] h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Real-time Gemini AI Transcript Display */}
              <div className="mt-5 p-5 rounded-2xl bg-[#3D3229] text-[#FDF8F3] relative overflow-hidden">
                <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: "4s" }} />
                    <span className="text-xs font-semibold tracking-wider uppercase text-amber-200/90">
                      Transcripción Gemini IA
                    </span>
                  </div>
                  <span className="text-[10px] text-white/50 bg-white/10 px-2 py-0.5 rounded-full">
                    {transcribing ? "Sincronizando..." : "Voz verificada"}
                  </span>
                </div>

                <p className="font-sans text-sm leading-relaxed text-amber-50/90 italic">
                  "{activeVoice.transcript}"
                </p>

                <div className="mt-3 flex items-center justify-between text-[11px] text-white/60 font-mono">
                  <span>Idioma: Español (AR)</span>
                  <span>Confianza: 99.4%</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
