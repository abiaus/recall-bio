"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Lock, Key, Users, Sparkles, Heart, CheckCircle2, Clock } from "lucide-react";

interface HeirStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  color: string;
}

const HEIR_STEPS: HeirStep[] = [
  {
    number: "01",
    title: "Registras tus memorias día a día",
    subtitle: "Audio, fotos y texto en tu bóveda privada",
    description:
      "Tus historias quedan guardadas bajo encriptación de extremo a extremo. Nadie, excepto tú, tiene acceso a tu archivo mientras decides mantenerlo privado.",
    icon: Lock,
    color: "bg-[#9CAF88]/30 text-[#3D3229]",
  },
  {
    number: "02",
    title: "Designas a tus herederos de confianza",
    subtitle: "Hijos, nietos, pareja o amigos cercanos",
    description:
      "Agregas las direcciones de correo de quienes recibirán tu herencia emocional. Puedes invitar a tantos herederos como desees y asignarles diferentes permisos.",
    icon: Users,
    color: "bg-[#B8A9C9]/30 text-[#3D3229]",
  },
  {
    number: "03",
    title: "Configuras las reglas de liberación",
    subtitle: "En vida, fechas especiales o momentos clave",
    description:
      "Decides exactamente cuándo se desbloquearán tus recuerdos. Puedes compartir álbumes en vida con código de paso o programar cápsulas que se abran en su cumpleaños de 18 años.",
    icon: Clock,
    color: "bg-[#D4A5A5]/30 text-[#3D3229]",
  },
  {
    number: "04",
    title: "Tus seres queridos heredan tu voz viva",
    subtitle: "Una conexión inquebrantable a través del tiempo",
    description:
      "Cuando llegue el momento, tus herederos podrán ingresar a su portal 'Legados Recibidos' para escuchar tu voz, leer tus palabras y sentir tu presencia viva siempre.",
    icon: Key,
    color: "bg-[#9E5D46] text-white",
  },
];

export function V3HeirVaultShowcase() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = HEIR_STEPS[activeStepIndex];

  return (
    <section id="boveda" className="py-20 bg-[#F7EDE4]/60 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#3D3229] tracking-tight">
            La Cápsula de Herederos
          </h2>
          <p className="font-sans text-base sm:text-lg text-[#6B5D4D] leading-relaxed">
            Tu archivo digital con reglas de custodia precisas. Garantiza que tu voz e historias lleguen intactas a la siguiente generación.
          </p>
        </div>

        {/* Step Cards Grid */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Interactive Step Selector */}
          <div className="lg:col-span-5 space-y-3">
            {HEIR_STEPS.map((step, idx) => {
              const isSelected = idx === activeStepIndex;
              const Icon = step.icon;

              return (
                <button
                  key={step.number}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`w-full text-left p-5 rounded-2xl transition-all duration-300 flex items-center gap-4 ${
                    isSelected
                      ? "bg-white border-2 border-[#9E5D46] shadow-md"
                      : "bg-white/60 hover:bg-white border border-[#F7EDE4]"
                  }`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${step.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-base text-[#3D3229]">
                      {step.title}
                    </h3>
                    <p className="text-xs text-[#6B5D4D] mt-0.5">{step.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Step Preview Interactive Board */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[32px] p-8 border border-[#F7EDE4] shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-[#F7EDE4] pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#9E5D46] text-white flex items-center justify-center font-serif font-bold text-lg">
                    {activeStep.number}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-[#3D3229]">
                      {activeStep.title}
                    </h3>
                    <p className="text-xs text-[#9B8B7A]">Protocolo de Legado Digital</p>
                  </div>
                </div>
                <ShieldCheck className="w-6 h-6 text-[#9CAF88]" />
              </div>

              <p className="font-sans text-base text-[#6B5D4D] leading-relaxed">
                {activeStep.description}
              </p>

              {/* Security Banner preview inside step */}
              <div className="p-5 rounded-2xl bg-[#FDF8F3] border border-[#F7EDE4] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-[#9E5D46]" />
                  <div>
                    <h4 className="font-semibold text-sm text-[#3D3229]">
                      Custodia Garantizada
                    </h4>
                    <p className="text-xs text-[#6B5D4D]">
                      Almacenamiento privado RLS + Control por código OTP
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#9CAF88] bg-[#9CAF88]/20 px-3 py-1 rounded-full">
                  Activo
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
