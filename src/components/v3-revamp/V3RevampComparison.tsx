"use client";

import { Check, X, Sparkles, AlertCircle } from "lucide-react";

export function V3RevampComparison() {
  return (
    <section className="py-24 bg-transparent text-[#FDF8F3] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-amber-200 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" /> La Diferencia de Legado
          </span>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            ¿Por qué Recall.bio y no discos duros o chats?
          </h2>

          <p className="font-sans text-base sm:text-lg text-amber-100/80 leading-relaxed">
            La diferencia entre el desorden digital que se olvida y un patrimonio emocional organizado.
          </p>
        </div>

        {/* Comparison Table Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Traditional Hard Drive / Chat Column */}
          <div className="bg-white/5 rounded-[36px] p-8 border border-white/10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-serif font-bold text-xl text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" /> Fotos Desordenadas & Discos
              </h3>
              <span className="text-xs text-rose-300/80 bg-rose-500/20 px-3 py-1 rounded-full font-semibold">
                Sin Estructura
              </span>
            </div>

            <ul className="space-y-4 text-sm text-amber-100/70">
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <span>Miles de fotos repetidas sin contexto ni voz explicativa</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <span>Audios de WhatsApp perdidos en copias de seguridad viejas</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <span>Discos duros y llaves USB que se corrompen en 5 a 10 años</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <span>Sin reglas de entrega ni contraseñas para tus herederos</span>
              </li>
            </ul>
          </div>

          {/* Recall.bio Column */}
          <div className="bg-gradient-to-b from-[#261E18] to-[#1C1612] rounded-[36px] p-8 border border-[#E07A5F] shadow-2xl space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-serif font-bold text-xl text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#E07A5F]" /> Santuario Recall.bio
              </h3>
              <span className="text-xs text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full font-semibold">
                Patrimonio Eterno
              </span>
            </div>

            <ul className="space-y-4 text-sm text-amber-50">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#81B29A] shrink-0 mt-0.5" />
                <span>**Voz auténtica preservada** junto a fotos y reflexiones diarias</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#81B29A] shrink-0 mt-0.5" />
                <span>**Transcripción Gemini IA** para buscar frases habladas en segundos</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#81B29A] shrink-0 mt-0.5" />
                <span>**Encriptación privada Supabase RLS** con respaldo de por vida</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#81B29A] shrink-0 mt-0.5" />
                <span>**Custodia de Herederos** con reglas de entrega en vida o por fechas</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
