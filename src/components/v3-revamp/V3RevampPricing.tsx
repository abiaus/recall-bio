"use client";

import { useState } from "react";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export function V3RevampPricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="membresia" className="py-24 bg-transparent text-[#FDF8F3] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-amber-200 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" /> Membresía Transparente
          </span>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            Planes Diseñados para Durar
          </h2>

          <p className="font-sans text-base sm:text-lg text-amber-100/80 leading-relaxed">
            Comienza gratis hoy. Actualiza cuando desees para desbloquear bóveda de voz ilimitada y transcripción por IA.
          </p>

          {/* Toggle Billing */}
          <div className="mt-8 inline-flex items-center gap-3 p-1.5 bg-white/10 rounded-2xl border border-white/10">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                !isAnnual
                  ? "bg-[#E07A5F] text-white shadow-lg"
                  : "text-amber-100/70 hover:text-white"
              }`}
            >
              Facturación Mensual
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                isAnnual
                  ? "bg-[#E07A5F] text-white shadow-lg"
                  : "text-amber-100/70 hover:text-white"
              }`}
            >
              <span>Facturación Anual</span>
              <span className="text-[10px] bg-amber-300 text-[#1C1612] px-2 py-0.5 rounded-full font-bold">
                Ahorra 25%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Free Tier */}
          <div className="bg-white/5 rounded-[40px] p-8 sm:p-10 border border-white/10 flex flex-col justify-between hover:bg-white/10 transition-all">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-2xl text-white">
                  Básico Gratuito
                </h3>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-amber-200">
                  Para Siempre
                </span>
              </div>
              <p className="text-sm text-amber-100/70 mt-2">
                Ideal para probar la experiencia diaria de reflexiones por voz.
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-serif text-5xl font-bold text-white">$0</span>
                <span className="text-sm text-amber-100/60">/ sin costo</span>
              </div>

              <ul className="mt-8 space-y-4 text-sm text-amber-100/90">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#81B29A] shrink-0" />
                  <span>1 pregunta diaria inspiradora</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#81B29A] shrink-0" />
                  <span>Audio de hasta 3 minutos por recuerdo</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#81B29A] shrink-0" />
                  <span>1 Heredero de confianza asignado</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#81B29A] shrink-0" />
                  <span>Almacenamiento seguro en Supabase</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <Link
                href="/es/auth/signup"
                className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-colors border border-white/10"
              >
                <span>Crear cuenta gratuita</span>
              </Link>
            </div>
          </div>

          {/* Pro Legado Tier */}
          <div className="bg-gradient-to-b from-[#1C1612] to-[#261E18] rounded-[40px] p-8 sm:p-10 border-2 border-[#E07A5F] shadow-2xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#E07A5F]/20 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-2xl text-amber-200 flex items-center gap-2">
                  <span>Pro Legado</span>
                  <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300" />
                </h3>
                <span className="text-xs font-bold px-3.5 py-1 rounded-full bg-[#E07A5F] text-white shadow-md">
                  Recomendado
                </span>
              </div>
              <p className="text-sm text-amber-100/70 mt-2">
                Bóveda completa e ilimitada para proteger la historia de tu vida.
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-serif text-5xl font-bold text-white">
                  {isAnnual ? "$7.40" : "$9.99"}
                </span>
                <span className="text-sm text-amber-100/60">
                  / mes {isAnnual ? "(facturado anualmente $89)" : ""}
                </span>
              </div>

              <ul className="mt-8 space-y-4 text-sm text-amber-50">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-amber-300 shrink-0" />
                  <span>Memorias de audio e historias **ilimitadas**</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-amber-300 shrink-0" />
                  <span>**Transcripción Gemini IA** ilimitada con búsqueda en texto</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-amber-300 shrink-0" />
                  <span>Hasta **5 Herederos** con reglas de liberación personalizadas</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-amber-300 shrink-0" />
                  <span>Hasta 5 fotografías por recuerdo en alta definición</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-amber-300 shrink-0" />
                  <span>Exportación de archivo completo en ZIP + MP3 + PDF</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <Link
                href="/es/auth/signup?plan=pro"
                className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-[#E07A5F] hover:bg-[#c86348] text-white font-bold text-base transition-all shadow-xl active:scale-95"
              >
                <span>Comenzar prueba Pro de 14 días</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
