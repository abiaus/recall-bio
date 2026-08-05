"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Unlock, Key, Users, Clock, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export function V3RevampHeirTerminal() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const steps = [
    {
      id: "s1",
      num: "01",
      title: "Registras tus memorias encriptadas",
      subtitle: "Audio de alta fidelidad, fotos y texto diario",
      detail:
        "Tus archivos se guardan bajo llaves de encriptación privadas RLS en Supabase. Nadie tiene acceso a tu material hasta que tú decidas otorgarlo.",
      badge: "Encriptado AES-256",
    },
    {
      id: "s2",
      num: "02",
      title: "Designas a tus herederos de confianza",
      subtitle: "Asignación de roles y relaciones familiares",
      detail:
        "Invitas a tus hijos, pareja o nietos indicando su correo. Puedes agregar notas privadas y personalizar qué carpetas podrá ver cada heredero.",
      badge: "Multi-Heredero",
    },
    {
      id: "s3",
      num: "03",
      title: "Configuras la regla de desbloqueo",
      subtitle: "Código en vida, fecha futura o legado",
      detail:
        "Decides si quieres compartir recuerdos en vida mediante un código OTP o programar cápsulas para momentos clave como sus 18 o 30 años.",
      badge: "Custodia Flexible",
    },
    {
      id: "s4",
      num: "04",
      title: "Entrega de la Llave Digital",
      subtitle: "Tus seres queridos conservan tu voz para siempre",
      detail:
        "Cuando la regla se cumpla, tus herederos reciben su acceso en el portal 'Legados Recibidos' para escuchar tu voz auténtica a través de generaciones.",
      badge: "Acceso Eterno",
    },
  ];

  return (
    <section id="herederos" className="py-24 bg-transparent text-[#FDF8F3] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-amber-200 text-xs font-semibold uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5 text-[#81B29A]" /> Protocolo de Herederos
          </span>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            La Terminal de Custodia
          </h2>

          <p className="font-sans text-base sm:text-lg text-amber-100/80 leading-relaxed">
            Control absoluto sobre quién y cuándo se accede a tu legado emocional.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
          
          {/* Left Step Selectors */}
          <div className="lg:col-span-5 space-y-3">
            {steps.map((step, idx) => {
              const isSelected = idx === activeTab;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveTab(idx)}
                  className={`w-full text-left p-6 rounded-3xl transition-all duration-300 flex items-center justify-between border ${
                    isSelected
                      ? "bg-white/15 border-[#E07A5F] shadow-2xl"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-serif font-bold text-2xl text-[#E07A5F]">
                      {step.num}
                    </span>
                    <div>
                      <h3 className="font-serif font-semibold text-base text-white">
                        {step.title}
                      </h3>
                      <p className="text-xs text-amber-100/70 mt-0.5">{step.subtitle}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Active Terminal Console */}
          <div className="lg:col-span-7">
            <div className="bg-[#1C1612] rounded-[40px] p-8 border border-white/15 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#E07A5F] text-white flex items-center justify-center font-bold">
                    {steps[activeTab].num}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-white">
                      {steps[activeTab].title}
                    </h3>
                    <p className="text-xs text-amber-100/60">Terminal de Reglas</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#81B29A]/20 text-[#81B29A]">
                  {steps[activeTab].badge}
                </span>
              </div>

              <p className="font-sans text-base text-amber-100/90 leading-relaxed">
                {steps[activeTab].detail}
              </p>

              {/* Status Box inside Terminal */}
              <div className="p-6 rounded-2xl bg-black/50 border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs text-amber-200 font-mono">
                  <span>Estado del Protocolo: ACTIVO</span>
                  <span>Verificación RLS: OK</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-[#E07A5F] to-[#81B29A] h-full w-[85%]" />
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/es/auth/signup"
                  className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-[#E07A5F] hover:bg-[#c86348] text-white font-bold text-sm transition-all shadow-lg"
                >
                  <span>Configurar mi bóveda de herederos</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
