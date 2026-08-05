"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Sparkles, RefreshCw, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

const PROMPTS = [
  "¿Cuál es el mejor consejo que recibiste en un momento de incertidumbre?",
  "¿Qué sentiste el día en que nació tu primer hijo o iniciaste tu camino personal?",
  "¿Qué valores aprendidos en tu infancia conservas intactos hoy?",
];

export function V3RevampStudio() {
  const [promptIdx, setPromptIdx] = useState(0);
  const [recordingState, setRecordingState] = useState<"idle" | "recording" | "transcribing" | "completed">("idle");
  const [timerSec, setTimerSec] = useState(0);
  const [transcriptText, setTranscriptText] = useState("");

  const sampleText =
    "Recordar el esfuerzo que hicimos para construir nuestra primera casa me llena de paz. Cada ladrillo representaba un sueño compartido y la certeza de que juntos nada podía detenernos.";

  const handleNextPrompt = () => {
    setPromptIdx((prev) => (prev + 1) % PROMPTS.length);
    setRecordingState("idle");
    setTimerSec(0);
    setTranscriptText("");
  };

  const handleStartRecording = () => {
    setRecordingState("recording");
    setTimerSec(0);
    setTranscriptText("");
  };

  useEffect(() => {
    let t: NodeJS.Timeout;
    if (recordingState === "recording") {
      t = setInterval(() => {
        setTimerSec((prev) => {
          if (prev >= 4) {
            setRecordingState("transcribing");
            return 5;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(t);
  }, [recordingState]);

  useEffect(() => {
    if (recordingState === "transcribing") {
      let curr = 0;
      const typeT = setInterval(() => {
        if (curr <= sampleText.length) {
          setTranscriptText(sampleText.slice(0, curr));
          curr += 3;
        } else {
          clearInterval(typeT);
          setRecordingState("completed");
        }
      }, 30);
      return () => clearInterval(typeT);
    }
  }, [recordingState]);

  return (
    <section id="laboratorio" className="py-24 bg-transparent text-[#FDF8F3] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-amber-200 text-xs font-semibold uppercase tracking-widest">
            <Mic className="w-3.5 h-3.5 text-[#E07A5F]" /> Laboratorio de Grabación en Vivo
          </span>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            Prueba la Inteligencia de Voz
          </h2>

          <p className="font-sans text-base sm:text-lg text-amber-100/80 leading-relaxed">
            Sin redactar largos correos ni mecanografiar. Solo responde la consigna con tu voz y Gemini IA la convierte en texto perfecto.
          </p>
        </div>

        {/* Studio Interactive Card */}
        <div className="mt-14 max-w-4xl mx-auto bg-white/5 backdrop-blur-2xl rounded-[44px] p-8 sm:p-12 border border-white/15 shadow-2xl space-y-8">
          
          {/* Header inside card */}
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <span className="font-serif font-semibold text-lg text-white">
              Consigna del Día #088
            </span>
            <button
              onClick={handleNextPrompt}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-200 bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Cambiar pregunta</span>
            </button>
          </div>

          {/* Active Question */}
          <div className="p-8 rounded-3xl bg-black/40 border border-white/10 text-center">
            <p className="font-serif text-2xl sm:text-3xl font-medium text-white leading-relaxed">
              "{PROMPTS[promptIdx]}"
            </p>
          </div>

          {/* Recording Control Box */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center space-y-6">
            {recordingState === "idle" && (
              <div className="space-y-4">
                <button
                  onClick={handleStartRecording}
                  className="w-20 h-20 rounded-full bg-[#E07A5F] hover:bg-[#c86348] text-white inline-flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all"
                >
                  <Mic className="w-9 h-9" />
                </button>
                <p className="text-xs font-semibold text-amber-200 uppercase tracking-wider">
                  Presiona para simular una respuesta de voz
                </p>
              </div>
            )}

            {recordingState === "recording" && (
              <div className="space-y-4">
                <div className="w-20 h-20 rounded-full bg-rose-600 text-white inline-flex items-center justify-center animate-pulse">
                  <Square className="w-8 h-8 fill-current" />
                </div>
                <div className="flex items-center justify-center gap-2 text-rose-300 font-mono text-sm font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span>GRABANDO... 0:0{timerSec}</span>
                </div>
              </div>
            )}

            {(recordingState === "transcribing" || recordingState === "completed") && (
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>
                    {recordingState === "transcribing"
                      ? "Procesando transcripción inteligente con Gemini IA..."
                      : "Transcripción Finalizada ✓"}
                  </span>
                </div>

                <div className="p-6 rounded-2xl bg-black/60 border border-white/15">
                  <p className="font-sans text-base text-amber-50 leading-relaxed italic">
                    {transcriptText}
                    {recordingState === "transcribing" && (
                      <span className="inline-block w-2 h-4 bg-[#E07A5F] ml-1 animate-pulse" />
                    )}
                  </p>
                </div>

                {recordingState === "completed" && (
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={handleNextPrompt}
                      className="px-5 py-2.5 rounded-xl text-xs font-semibold text-amber-100 bg-white/10 hover:bg-white/20 border border-white/10"
                    >
                      Probar otra consigna
                    </button>
                    <Link
                      href="/es/auth/signup"
                      className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#E07A5F] hover:bg-[#c86348]"
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
    </section>
  );
}
