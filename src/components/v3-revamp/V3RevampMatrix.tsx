"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, ShieldCheck, Heart, Sparkles, User, Lock, Unlock } from "lucide-react";

interface MatrixItem {
  id: string;
  question: string;
  author: string;
  role: string;
  date: string;
  heir: string;
  mood: "Agradecido" | "Nostálgico" | "Feliz" | "Contemplativo";
  moodColor: string;
  transcript: string;
  duration: string;
}

const MATRIX_ITEMS: MatrixItem[] = [
  {
    id: "m1",
    question: "¿Cuál es la enseñanza de tus padres que más guía tus decisiones hoy?",
    author: "María Inés",
    role: "Madre & Abuela (64 años)",
    date: "14 de Mayo, 2024",
    heir: "Para: Belén y Tomás (Acceso Inmediato)",
    mood: "Agradecido",
    moodColor: "bg-[#81B29A]/30 text-emerald-200",
    transcript:
      "Mi madre siempre me decía: 'Al final del día, lo único que realmente te pertenece es tu honestidad'. Cada vez que tuve que tomar una decisión difícil en mi carrera o con la familia, respiré profundo y me pregunté si estaba siendo fiel a esa enseñanza.",
    duration: "1:14",
  },
  {
    id: "m2",
    question: "Cuéntame sobre el día en que supiste que querías dedicarte a tu vocación.",
    author: "Carlos Alberto",
    role: "Padre (58 años)",
    date: "2 de Noviembre, 2024",
    heir: "Para: Nicolás (Bóveda 2035)",
    mood: "Nostálgico",
    moodColor: "bg-[#E07A5F]/30 text-rose-200",
    transcript:
      "Llovía torrencialmente aquella tarde de 1988 en el viejo laboratorio... Tenía solo 22 años y mi primer plano fue aprobado. Recuerdo correr bajo la lluvia para llamar a mi padre desde un teléfono público.",
    duration: "2:05",
  },
  {
    id: "m3",
    question: "¿Qué sentiste en tus brazos cuando sostuviste a tu primer hijo por primera vez?",
    author: "Gonzalo & Sofía",
    role: "Jóvenes Padres (32 años)",
    date: "18 de Enero, 2025",
    heir: "Para: Mateo (Cápsula de los 18 años)",
    mood: "Feliz",
    moodColor: "bg-[#F2CC8F]/30 text-amber-200",
    transcript:
      "Todo el ruido del mundo se apagó en un segundo. Eras tan pequeño que entrabas en el antebrazo de tu papá. Prometí en silencio cuidarte cada día de mi vida.",
    duration: "1:48",
  },
  {
    id: "m4",
    question: "¿Cuál fue el viaje o aventura que cambió tu manera de ver la vida?",
    author: "Eduardo V.",
    role: "Abuelo (72 años)",
    date: "8 de Diciembre, 2024",
    heir: "Para: Toda la Familia (Legado Abierto)",
    mood: "Contemplativo",
    moodColor: "bg-purple-500/30 text-purple-200",
    transcript:
      "Cruzamos los Andes en camioneta cuando no había rutas asfaltadas. Nos quedamos sin gasolina cerca de la frontera y unos arrieros nos hospedaron en su rancho. Aprendí que la generosidad no depende de lo que tienes.",
    duration: "2:30",
  },
];

export function V3RevampMatrix() {
  const [selectedMood, setSelectedMood] = useState<string>("Todos");
  const [playingId, setPlayingId] = useState<string | null>(null);

  const moods = ["Todos", "Agradecido", "Nostálgico", "Feliz", "Contemplativo"];

  const filtered =
    selectedMood === "Todos"
      ? MATRIX_ITEMS
      : MATRIX_ITEMS.filter((item) => item.mood === selectedMood);

  return (
    <section id="matriz" className="py-24 bg-transparent text-[#FDF8F3] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-amber-200 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" /> La Matriz de Historias
          </span>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            El Archivo de Historias Habladas
          </h2>

          <p className="font-sans text-base sm:text-lg text-amber-100/80 leading-relaxed">
            Cada bloque es una voz preservada para siempre. Escucha fragmentos reales custodiados en la plataforma.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {moods.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMood(m)}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                selectedMood === m
                  ? "bg-[#E07A5F] text-white shadow-lg"
                  : "bg-white/10 text-amber-100/70 hover:bg-white/20"
              }`}
            >
              {m === "Todos" ? "✨ Todas las Historias" : m}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => {
              const isPlayingThis = playingId === item.id;

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white/5 backdrop-blur-xl rounded-[36px] p-8 border border-white/10 shadow-2xl flex flex-col justify-between hover:border-[#E07A5F]/50 transition-all duration-500 group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${item.moodColor}`}>
                        {item.mood}
                      </span>
                      <span className="text-xs text-amber-100/60 font-mono">
                        {item.duration} • {item.date}
                      </span>
                    </div>

                    <h3 className="font-serif font-semibold text-xl sm:text-2xl text-white leading-snug group-hover:text-[#E07A5F] transition-colors">
                      "{item.question}"
                    </h3>

                    <p className="mt-4 text-sm text-amber-100/80 leading-relaxed italic bg-black/30 p-4 rounded-2xl border border-white/5">
                      "{item.transcript}"
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-sm text-white block">
                        {item.author} ({item.role})
                      </span>
                      <span className="text-xs text-amber-100/60 block mt-0.5">
                        {item.heir}
                      </span>
                    </div>

                    <button
                      onClick={() => setPlayingId(isPlayingThis ? null : item.id)}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                        isPlayingThis ? "bg-[#81B29A] text-white" : "bg-[#E07A5F] hover:bg-[#c86348] text-white"
                      } shadow-lg active:scale-95`}
                    >
                      {isPlayingThis ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
