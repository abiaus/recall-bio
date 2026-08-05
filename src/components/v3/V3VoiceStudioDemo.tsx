"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Sparkles, RefreshCw, CheckCircle2, Volume2, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

const DEMO_PROMPTS = [
  "¿Cuál fue el momento de mayor orgullo que viviste con tu familia?",
  "¿Qué consejo le darías a tu yo de 20 años si pudieras hablarle hoy?",
  "¿Cuál es el recuerdo más dulce que conservas de tu infancia?",
  "¿Cómo superaste la mayor prueba de coraje que te puso la vida?",
];

export function V3VoiceStudioDemo() {
  const [promptIndex, setPromptIndex] = useState(0);
  const [recordingState, setRecordingState] = useState<"idle" | "recording" | "transcribing" | "completed">("idle");
  const [seconds, setSeconds] = useState(0);
  const [typedTranscript, setTypedTranscript] = useState("");

  const sampleAnswer =
    "Recordar el esfuerzo que hicimos para construir nuestra primera casa me llena de paz. Cada ladrillo representaba un sueño compartido y la certeza de que juntos nada podía detenernos.";

  const nextPrompt = () => {
    setPromptIndex((prev) => (prev + 1) % DEMO_PROMPTS.length);
    setRecordingState("idle");
    setSeconds(0);
    setTypedTranscript("");
  };

  const startDemoRecord = () => {
    setRecordingState("recording");
    setSeconds(0);
    setTypedTranscript("");
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (recordingState === "recording") {
      timer = setInterval(() => {
        setSeconds((prev) => {
          if (prev >= 4) {
            setRecordingState("transcribing");
            return 5;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [recordingState]);

  useEffect(() => {
    if (recordingState === "transcribing") {
      let currentLength = 0;
      const typeTimer = setInterval(() => {
        if (currentLength <= sampleAnswer.length) {
          setTypedTranscript(sampleAnswer.slice(0, currentLength));
          currentLength += 3;
        } else {
          clearInterval(typeTimer);
          setRecordingState("completed");
        }
      }, 30);
      return () => clearInterval(typeTimer);
    }
  }, [recordingState]);

  return (
    <section id="estudio" className="py-20 bg-[#FDF8F3] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Information */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#3D3229] leading-tight">
              El Estudio de Grabación Diario
            </h2>

            <p className="font-sans text-base sm:text-lg text-[#6B5D4D] leading-relaxed">
              No tienes que preocuparte por qué escribir. Cada día recibes una pregunta inspiradora ajustada a tu etapa de vida. Presionas grabar, hablas con naturalidad y Gemini IA convierte tus palabras en texto buscando cada detalle.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#9CAF88]/30 text-[#3D3229] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-[#9E5D46]" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-[#3D3229]">Sin esfuerzo de mecanografía</h4>
                  <p className="text-xs text-[#6B5D4D]">Habla desde la comodidad de tu teléfono o computadora.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#B8A9C9]/30 text-[#3D3229] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-[#9E5D46]" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-[#3D3229]">Transcripción Inteligente en Español e Inglés</h4>
                  <p className="text-xs text-[#6B5D4D]">Búsqueda por texto de pasajes de audio específicos.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#D4A5A5]/30 text-[#3D3229] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-[#9E5D46]" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-[#3D3229]">Bóveda de Archivo con Copia de Seguridad</h4>
                  <p className="text-xs text-[#6B5D4D]">Tus archivos de voz originales guardados en alta fidelidad.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Studio Simulator */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#F7EDE4] shadow-xl space-y-6">
              
              {/* Top Bar inside Simulator */}
              <div className="flex items-center justify-between border-b border-[#F7EDE4] pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#9E5D46]" />
                  <span className="font-serif font-semibold text-sm text-[#3D3229]">
                    Pregunta del Día #142
                  </span>
                </div>

                <button
                  onClick={nextPrompt}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B5D4D] hover:text-[#9E5D46] bg-[#F7EDE4] px-3 py-1.5 rounded-xl transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Cambiar pregunta</span>
                </button>
              </div>

              {/* Prompt Question Display */}
              <div className="p-6 rounded-2xl bg-[#FDF8F3] border border-[#F7EDE4]">
                <p className="font-serif text-xl sm:text-2xl text-[#3D3229] font-medium leading-relaxed">
                  "{DEMO_PROMPTS[promptIndex]}"
                </p>
              </div>

              {/* Recording Controls Area */}
              <div className="p-6 rounded-2xl bg-[#F7EDE4]/60 border border-[#F7EDE4] text-center space-y-4">
                {recordingState === "idle" && (
                  <div className="space-y-3">
                    <button
                      onClick={startDemoRecord}
                      className="w-16 h-16 rounded-full bg-[#9E5D46] hover:bg-[#854B36] text-white inline-flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
                    >
                      <Mic className="w-8 h-8" />
                    </button>
                    <p className="text-xs font-semibold text-[#6B5D4D]">
                      Presiona para simular una respuesta de voz
                    </p>
                  </div>
                )}

                {recordingState === "recording" && (
                  <div className="space-y-3">
                    <div className="w-16 h-16 rounded-full bg-rose-600 text-white inline-flex items-center justify-center animate-pulse">
                      <Square className="w-7 h-7 fill-current" />
                    </div>
                    <div className="flex items-center justify-center gap-2 text-rose-700 font-mono text-sm font-semibold">
                      <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                      <span>Grabando... 0:0{seconds}</span>
                    </div>
                  </div>
                )}

                {(recordingState === "transcribing" || recordingState === "completed") && (
                  <div className="space-y-4 text-left">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#9E5D46]">
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>
                        {recordingState === "transcribing"
                          ? "Transcripción automática por Gemini IA en proceso..."
                          : "Transcripción Finalizada ✓"}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-[#F7EDE4]">
                      <p className="font-sans text-sm text-[#3D3229] leading-relaxed">
                        {typedTranscript}
                        {recordingState === "transcribing" && (
                          <span className="inline-block w-1.5 h-4 bg-[#9E5D46] ml-1 animate-pulse" />
                        )}
                      </p>
                    </div>

                    {recordingState === "completed" && (
                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          onClick={nextPrompt}
                          className="px-4 py-2 rounded-xl text-xs font-medium text-[#6B5D4D] bg-white border border-[#F7EDE4]"
                        >
                          Probar otro prompt
                        </button>
                        <Link
                          href="/es/auth/signup"
                          className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#9E5D46] hover:bg-[#854B36]"
                        >
                          Guardar mi primer recuerdo
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
