"use client";

import { useState } from "react";
import { Check, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export function V3PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="precios" className="py-20 bg-[#F7EDE4]/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#3D3229] tracking-tight">
            Planes Transparentes para Tu Legado
          </h2>
          <p className="font-sans text-base sm:text-lg text-[#6B5D4D] leading-relaxed">
            Comienza gratis hoy. Actualiza cuando quieras para desbloquear bóveda ilimitada y transcripción por inteligencia artificial.
          </p>

          {/* Billing Switcher */}
          <div className="mt-8 inline-flex items-center gap-3 p-1.5 bg-white rounded-2xl border border-[#F7EDE4] shadow-sm">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                !isAnnual
                  ? "bg-[#9E5D46] text-white shadow-sm"
                  : "text-[#6B5D4D] hover:text-[#3D3229]"
              }`}
            >
              Pago Mensual
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                isAnnual
                  ? "bg-[#9E5D46] text-white shadow-sm"
                  : "text-[#6B5D4D] hover:text-[#3D3229]"
              }`}
            >
              <span>Pago Anual</span>
              <span className="text-[10px] bg-amber-200 text-[#3D3229] px-2 py-0.5 rounded-full font-bold">
                Ahorra 25%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Free Card */}
          <div className="bg-white rounded-[32px] p-8 border border-[#F7EDE4] shadow-sm flex flex-col justify-between hover:shadow-lg transition-all">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-2xl text-[#3D3229]">
                  Básico Gratuito
                </h3>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E8EDE5] text-[#3D3229]">
                  Para Siempre
                </span>
              </div>
              <p className="text-sm text-[#6B5D4D] mt-2">
                Ideal para comenzar tu rutina diaria de memorias habladas.
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-serif text-4xl sm:text-5xl font-bold text-[#3D3229]">
                  $0
                </span>
                <span className="text-sm text-[#9B8B7A]">/ sin costo</span>
              </div>

              <ul className="mt-8 space-y-3.5 text-sm text-[#3D3229]">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#9CAF88] shrink-0" />
                  <span>1 pregunta diaria inspiradora</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#9CAF88] shrink-0" />
                  <span>Grabación de audio de hasta 3 minutos</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#9CAF88] shrink-0" />
                  <span>1 Heredero de confianza designado</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#9CAF88] shrink-0" />
                  <span>Almacenamiento seguro en Supabase</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-[#F7EDE4]">
              <Link
                href="/es/auth/signup"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#F7EDE4] hover:bg-[#E8EDE5] text-[#3D3229] font-semibold text-sm transition-colors"
              >
                <span>Crear cuenta gratuita</span>
              </Link>
            </div>
          </div>

          {/* Pro Legado Card */}
          <div className="bg-[#3D3229] text-white rounded-[32px] p-8 border border-[#3D3229] shadow-2xl flex flex-col justify-between relative overflow-hidden">
            {/* Ambient glow inside pro card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#9E5D46]/20 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-2xl text-amber-100 flex items-center gap-2">
                  <span>Pro Legado</span>
                  <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300" />
                </h3>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#9E5D46] text-white shadow-sm">
                  Más Popular
                </span>
              </div>
              <p className="text-sm text-amber-100/70 mt-2">
                Bóveda completa e ilimitada para proteger la historia de tu vida.
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-serif text-4xl sm:text-5xl font-bold text-white">
                  {isAnnual ? "$7.40" : "$9.99"}
                </span>
                <span className="text-sm text-amber-100/70">
                  / mes {isAnnual ? "(facturado anualmente $89)" : ""}
                </span>
              </div>

              <ul className="mt-8 space-y-3.5 text-sm text-amber-50/90">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-amber-300 shrink-0" />
                  <span>Memorias de audio e historias **ilimitadas**</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-amber-300 shrink-0" />
                  <span>**Transcripción Gemini IA** ilimitada con búsqueda por texto</span>
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
                className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-[#9E5D46] hover:bg-[#854B36] text-white font-semibold text-base transition-all shadow-lg active:scale-95"
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
