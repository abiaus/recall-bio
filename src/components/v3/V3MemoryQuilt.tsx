"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, ShieldCheck, Heart, Sparkles, Filter, Lock, Unlock, Calendar, User } from "lucide-react";

interface MemoryQuiltItem {
  id: string;
  question: string;
  author: string;
  authorRole: string;
  date: string;
  heirs: string;
  releaseRule: string;
  mood: "Feliz" | "Agradecido" | "Contemplativo" | "Nostálgico" | "En Paz";
  moodBg: string;
  transcript: string;
  audioDuration: string;
  hasPhoto: boolean;
  photoUrl?: string;
}

const MEMORY_QUILT_ITEMS: MemoryQuiltItem[] = [
  {
    id: "m1",
    question: "¿Cuál es la enseñanza de tus padres que más guía tus decisiones hoy?",
    author: "María Inés",
    authorRole: "Madre & Abuela (64 años)",
    date: "14 de Mayo, 2024",
    heirs: "Para: Belén y Tomás",
    releaseRule: "Acceso Inmediato",
    mood: "Agradecido",
    moodBg: "bg-[#9CAF88]/20 text-[#3D3229]",
    transcript:
      "Mi madre siempre me decía: 'Al final del día, lo único que realmente te pertenece es tu honestidad'. Cada vez que tuve que tomar una decisión difícil en mi carrera o con la familia, respiré profundo y me pregunté si estaba siendo fiel a esa enseñanza.",
    audioDuration: "1:14",
    hasPhoto: true,
  },
  {
    id: "m2",
    question: "Cuéntame sobre el día en que supiste que querías dedicarte a tu vocación.",
    author: "Carlos Alberto",
    authorRole: "Padre (58 años)",
    date: "2 de Noviembre, 2024",
    heirs: "Para: Nicolás",
    releaseRule: "Bóveda Programada (2035)",
    mood: "Nostálgico",
    moodBg: "bg-[#D4A5A5]/25 text-[#3D3229]",
    transcript:
      "Llovía torrencialmente aquella tarde de 1988 en el viejo laboratorio... Tenía solo 22 años y mi primer plano arquitectónico fue aprobado. Recuerdo correr bajo la lluvia para llamar a mi padre desde un teléfono público.",
    audioDuration: "2:05",
    hasPhoto: false,
  },
  {
    id: "m3",
    question: "¿Qué sentiste en tus brazos cuando sostuviste a tu primer hijo por primera vez?",
    author: "Sofía & Gonzalo",
    authorRole: "Jóvenes Padres (32 años)",
    date: "18 de Enero, 2025",
    heirs: "Para: Mateo (Cápsula de los 18 años)",
    releaseRule: "Liberación al cumplir 18 años",
    mood: "Feliz",
    moodBg: "bg-amber-100 text-[#3D3229]",
    transcript:
      "Todo el ruido del mundo se apagó en un segundo. Eras tan pequeño que entrabas en el antebrazo de tu papá. Prometí en silencio cuidarte cada día de mi vida y enseñarte a amar con todo el corazón.",
    audioDuration: "1:48",
    hasPhoto: true,
  },
  {
    id: "m4",
    question: "¿Cuál fue el viaje o aventura que cambió tu manera de ver la vida?",
    author: "Eduardo V.",
    authorRole: "Abuelo (72 años)",
    date: "8 de Diciembre, 2024",
    heirs: "Para: Toda la Familia",
    releaseRule: "Legado Abierto",
    mood: "Contemplativo",
    moodBg: "bg-[#B8A9C9]/25 text-[#3D3229]",
    transcript:
      "Cruzamos los Andes en camioneta con tu abuela cuando no había rutas asfaltadas. Nos quedamos sin gasolina cerca de la frontera y unos arrieros nos hospedaron en su rancho durante dos días. Aprendí que la generosidad no depende de lo que tienes.",
    audioDuration: "2:30",
    hasPhoto: true,
  },
  {
    id: "m5",
    question: "¿Cómo recuerdas las tardes de los domingos en la casa de tu infancia?",
    author: "Graciela T.",
    authorRole: "Madre (51 años)",
    date: "27 de Febrero, 2025",
    heirs: "Para: Camila & Santiago",
    releaseRule: "Acceso Privado",
    mood: "En Paz",
    moodBg: "bg-[#E8EDE5] text-[#3D3229]",
    transcript:
      "El sonido del radio a galena encendido en la cocina, la sombra de la parra en el patio y las risas de mis hermanos jugando a las canicas... Esos domingos parecían no terminar nunca.",
    audioDuration: "1:22",
    hasPhoto: false,
  },
];

export function V3MemoryQuilt() {
  const [selectedMood, setSelectedMood] = useState<string>("Todos");
  const [playingId, setPlayingId] = useState<string | null>(null);

  const moods = ["Todos", "Agradecido", "Nostálgico", "Feliz", "Contemplativo", "En Paz"];

  const filteredMemories =
    selectedMood === "Todos"
      ? MEMORY_QUILT_ITEMS
      : MEMORY_QUILT_ITEMS.filter((m) => m.mood === selectedMood);

  const togglePlayCard = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
    }
  };

  return (
    <section id="tapiz" className="py-20 bg-[#F7EDE4]/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#3D3229] tracking-tight">
            El Tapiz Vivo de Memorias
          </h2>
          <p className="font-sans text-base sm:text-lg text-[#6B5D4D] leading-relaxed">
            Cada recuerdo grabado es un parche de historia viva. Escucha fragmentos reales preservados en la voz original de sus autores.
          </p>
        </div>

        {/* Mood Filter Bar */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {moods.map((mood) => (
            <button
              key={mood}
              onClick={() => setSelectedMood(mood)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                selectedMood === mood
                  ? "bg-[#9E5D46] text-white shadow-sm"
                  : "bg-white text-[#6B5D4D] hover:bg-[#FDF8F3] border border-[#F7EDE4]"
              }`}
            >
              {mood === "Todos" ? "✨ Todos los Recuerdos" : mood}
            </button>
          ))}
        </div>

        {/* Memory Cards Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredMemories.map((item) => {
              const isPlayingThis = playingId === item.id;

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-[28px] p-6 sm:p-7 border border-[#F7EDE4] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Row: Mood Badge & Duration */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${item.moodBg}`}>
                        {item.mood}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-[#9B8B7A] font-mono">
                        <Volume2 className="w-3.5 h-3.5 text-[#9E5D46]" />
                        <span>{item.audioDuration}</span>
                      </div>
                    </div>

                    {/* Prompt Title */}
                    <h3 className="font-serif font-semibold text-lg sm:text-xl text-[#3D3229] leading-snug group-hover:text-[#9E5D46] transition-colors">
                      "{item.question}"
                    </h3>

                    {/* Transcript Excerpt */}
                    <p className="mt-4 text-sm text-[#6B5D4D] leading-relaxed italic line-clamp-3 bg-[#FDF8F3] p-3.5 rounded-2xl border border-[#F7EDE4]">
                      "{item.transcript}"
                    </p>
                  </div>

                  {/* Card Bottom: Author & Audio Player Trigger */}
                  <div className="mt-6 pt-5 border-t border-[#F7EDE4] flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[#9E5D46]" />
                        <span className="font-semibold text-sm text-[#3D3229]">
                          {item.author}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#9B8B7A] mt-0.5">{item.heirs}</p>
                    </div>

                    <button
                      onClick={() => togglePlayCard(item.id)}
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                        isPlayingThis
                          ? "bg-[#3D3229] text-white"
                          : "bg-[#9E5D46] hover:bg-[#854B36] text-white"
                      } shadow-sm active:scale-95`}
                      aria-label={isPlayingThis ? "Pausar" : "Escuchar"}
                    >
                      {isPlayingThis ? (
                        <Pause className="w-5 h-5 fill-current" />
                      ) : (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      )}
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
