"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Mic, Sparkles, Volume2, ArrowRight, ShieldCheck, Disc } from "lucide-react";
import Link from "next/link";

interface VoiceMemory {
  id: string;
  title: string;
  speaker: string;
  year: string;
  transcript: string;
  color: string;
  frequencies: number[];
}

const VOICES: VoiceMemory[] = [
  {
    id: "v1",
    title: "La guitarra Criolla de 1984 y el primer recital",
    speaker: "Roberto M. (Papá)",
    year: "1984",
    transcript:
      "Ahorré tres sueldos trabajando en el taller de mi tío para comprar esa vieja guitarra... Cuando afinamos la primera cuerda y miré a tu madre entre el público, supe que ese instante duraría toda la vida.",
    color: "#E07A5F",
    frequencies: [35, 75, 95, 50, 90, 100, 65, 80, 45, 90, 75, 60, 85, 95, 50, 80, 65, 90, 40, 75],
  },
  {
    id: "v2",
    title: "El verdadero secreto para superar momentos difíciles",
    speaker: "Elena R. (Mamá)",
    year: "1998",
    transcript:
      "Hijita, cuando todo parezca incierto, recuerda que los días oscuros solo están preparando el terreno para lo que florecerá después. No tengas miedo de empezar de nuevo.",
    color: "#81B29A",
    frequencies: [45, 80, 60, 95, 70, 35, 85, 100, 50, 75, 90, 65, 40, 85, 70, 90, 55, 75, 40, 65],
  },
  {
    id: "v3",
    title: "Las tardes de domingo en el campo de la abuela",
    speaker: "Don Mateo (Abuelo)",
    year: "1972",
    transcript:
      "En la vieja casa del campo, los domingos olían a albahaca fresca y pan casero. Esos almuerzos largos no eran solo comida; eran la excusa para escucharnos sin prisa.",
    color: "#F2CC8F",
    frequencies: [25, 55, 85, 100, 45, 90, 65, 40, 95, 80, 55, 90, 70, 45, 80, 95, 60, 75, 50, 85],
  },
];

export function V3RevampHero() {
  const [activeVoice, setActiveVoice] = useState<VoiceMemory>(VOICES[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Audio Sphere Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 450);
    let height = (canvas.height = 450);

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;

      angle += isPlaying ? 0.02 : 0.005;

      // Outer Glowing Ring
      const ringRadius = 140;
      const pointCount = 64;

      ctx.beginPath();
      for (let i = 0; i <= pointCount; i++) {
        const theta = (i / pointCount) * Math.PI * 2;
        const wave = isPlaying
          ? Math.sin(theta * 8 + angle * 3) * 12 + Math.cos(theta * 4 - angle * 2) * 8
          : Math.sin(theta * 4 + angle) * 4;

        const r = ringRadius + wave;
        const x = cx + Math.cos(theta) * r;
        const y = cy + Math.sin(theta) * r;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();

      const grad = ctx.createRadialGradient(cx, cy, 50, cx, cy, ringRadius + 30);
      grad.addColorStop(0, `${activeVoice.color}66`);
      grad.addColorStop(0.7, `${activeVoice.color}22`);
      grad.addColorStop(1, "transparent");

      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = activeVoice.color;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Center Core Sphere
      ctx.beginPath();
      ctx.arc(cx, cy, 60 + (isPlaying ? Math.sin(angle * 4) * 5 : 0), 0, Math.PI * 2);
      ctx.fillStyle = activeVoice.color;
      ctx.fill();

      // Particle Dust
      for (let p = 0; p < 25; p++) {
        const px = cx + Math.cos(angle * 2 + p) * (ringRadius + (p % 20));
        const py = cy + Math.sin(angle * 2 + p) * (ringRadius + (p % 20));
        ctx.fillStyle = "#FDF8F3";
        ctx.beginPath();
        ctx.arc(px, py, (p % 3) + 1, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [isPlaying, activeVoice]);

  return (
    <section id="experiencia" className="relative min-h-[90vh] pt-12 pb-24 bg-transparent text-[#FDF8F3] overflow-hidden flex items-center">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl h-[600px] bg-radial from-[#E07A5F]/20 via-[#1C1612]/90 to-transparent rounded-[80px] blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline & Statement */}
          <div className="lg:col-span-6 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15">
              <Sparkles className="w-4 h-4 text-[#E07A5F]" />
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-200">
                La Bóveda de Legado Sonoro • Rediseño Total
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white">
              Tu voz es la única huella digital que dura para siempre.
            </h1>

            <p className="font-sans text-lg sm:text-xl text-amber-100/80 leading-relaxed max-w-xl">
              Recall.bio transforma tus historias habladas en un archivo ceremonial encriptado. Un ritual diario con transcripción por inteligencia artificial y reglas de custodia inviolables para tus herederos.
            </p>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/es/auth/signup"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#E07A5F] to-[#C4907C] hover:opacity-90 text-white font-bold text-base transition-all shadow-xl active:scale-95 group"
              >
                <Mic className="w-5 h-5 text-amber-200" />
                <span>Comenzar mi bóveda de voz</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#laboratorio"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-amber-100 font-medium text-base transition-colors border border-white/10"
              >
                <Disc className="w-4 h-4 text-amber-300" />
                <span>Probar laboratorio</span>
              </a>
            </div>

            {/* Key stats */}
            <div className="pt-8 border-t border-white/10 grid grid-cols-3 gap-4">
              <div>
                <span className="font-serif text-2xl font-bold text-white block">100%</span>
                <span className="text-xs text-amber-100/60">Privado & RLS</span>
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-amber-200 block">Gemini IA</span>
                <span className="text-xs text-amber-100/60">Transcripción Viva</span>
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-[#81B29A] block">Hasta 5</span>
                <span className="text-xs text-amber-100/60">Herederos de Voz</span>
              </div>
            </div>
          </div>

          {/* Right Column: Audio Reactor Canvas & Live Player */}
          <div className="lg:col-span-6">
            <div className="relative bg-white/5 backdrop-blur-2xl rounded-[44px] p-8 border border-white/15 shadow-2xl space-y-6">
              
              {/* Selector Tabs */}
              <div className="flex flex-wrap gap-2 pb-2">
                {VOICES.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setActiveVoice(v);
                      setIsPlaying(true);
                    }}
                    className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all ${
                      activeVoice.id === v.id
                        ? "bg-[#E07A5F] text-white shadow-lg"
                        : "bg-white/10 text-amber-100/70 hover:bg-white/20"
                    }`}
                  >
                    {v.speaker}
                  </button>
                ))}
              </div>

              {/* Interactive Audio Reactor Canvas */}
              <div className="relative flex items-center justify-center">
                <canvas ref={canvasRef} className="w-[360px] h-[360px] max-w-full" />
                
                {/* Floating Play Button inside Canvas */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="absolute w-16 h-16 rounded-full bg-[#E07A5F] hover:bg-[#c86348] text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all"
                  aria-label={isPlaying ? "Pausar" : "Reproducir"}
                >
                  {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-1" />}
                </button>
              </div>

              {/* Active Audio Info */}
              <div className="p-6 rounded-3xl bg-black/40 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-white">
                      "{activeVoice.title}"
                    </h3>
                    <p className="text-xs text-amber-200/80">
                      {activeVoice.speaker} • Año {activeVoice.year}
                    </p>
                  </div>
                  <Volume2 className="w-5 h-5 text-[#E07A5F]" />
                </div>

                <p className="font-sans text-sm italic text-amber-50/90 leading-relaxed pt-1">
                  "{activeVoice.transcript}"
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
