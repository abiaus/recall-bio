"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Key, ShieldCheck, Sparkles, RefreshCw, CheckCircle2, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

export function V3VaultLockMechanism() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [angle, setAngle] = useState(0); // in degrees
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [stepProgress, setStepProgress] = useState<number>(0);
  const isDraggingRef = useRef(false);
  const centerRef = useRef({ x: 150, y: 150 });
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Web Audio API mechanical haptic click synthesizer
  const playClickSound = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      // Audio fallback
    }
  }, []);

  const playUnlockSuccessSound = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);

        gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + i * 0.1);
        osc.stop(ctx.currentTime + i * 0.1 + 0.3);
      });
    } catch (e) {
      // Audio fallback
    }
  }, []);

  // Check Combination Lock Steps based on Angle
  const updateAngle = (newAngle: number) => {
    const normalized = (newAngle % 360 + 360) % 360;
    setAngle(normalized);

    // Combination logic: step 1 (around 90 deg), step 2 (around 180 deg), step 3 (around 270 deg)
    if (stepProgress === 0 && Math.abs(normalized - 90) < 20) {
      setStepProgress(1);
      playClickSound();
    } else if (stepProgress === 1 && Math.abs(normalized - 180) < 20) {
      setStepProgress(2);
      playClickSound();
    } else if (stepProgress === 2 && Math.abs(normalized - 270) < 20) {
      setStepProgress(3);
      setIsUnlocked(true);
      playUnlockSuccessSound();
    }
  };

  const rotateStepManually = (targetDeg: number) => {
    updateAngle(targetDeg);
  };

  const resetVault = () => {
    setAngle(0);
    setStepProgress(0);
    setIsUnlocked(false);
  };

  // Canvas Vault Dial Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = 300);
    const height = (canvas.height = 300);
    const cx = width / 2;
    const cy = height / 2;
    centerRef.current = { x: cx, y: cy };

    ctx.clearRect(0, 0, width, height);

    // Outer Vault Steel Bezel Ring
    ctx.beginPath();
    ctx.arc(cx, cy, 135, 0, Math.PI * 2);
    ctx.fillStyle = "#3D3229";
    ctx.fill();
    ctx.strokeStyle = "#8B6F4E";
    ctx.lineWidth = 4;
    ctx.stroke();

    // Inner Metallic Face
    ctx.beginPath();
    ctx.arc(cx, cy, 115, 0, Math.PI * 2);
    ctx.fillStyle = "#F7EDE4";
    ctx.fill();
    ctx.strokeStyle = "#C4907C";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Dial Markings & Numbers (0 to 360 degrees)
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((angle * Math.PI) / 180);

    for (let i = 0; i < 360; i += 15) {
      const rad = (i * Math.PI) / 180;
      const isMajor = i % 45 === 0;
      const innerR = isMajor ? 88 : 98;
      const outerR = 108;

      ctx.beginPath();
      ctx.moveTo(Math.cos(rad) * innerR, Math.sin(rad) * innerR);
      ctx.lineTo(Math.cos(rad) * outerR, Math.sin(rad) * outerR);
      ctx.strokeStyle = isMajor ? "#9E5D46" : "#9B8B7A";
      ctx.lineWidth = isMajor ? 3 : 1;
      ctx.stroke();

      if (isMajor) {
        ctx.fillStyle = "#3D3229";
        ctx.font = "bold 11px Outfit, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(i.toString(), Math.cos(rad) * 75, Math.sin(rad) * 75);
      }
    }

    // Center Mechanical Handle / Knob
    ctx.beginPath();
    ctx.arc(0, 0, 48, 0, Math.PI * 2);
    ctx.fillStyle = "#9E5D46";
    ctx.fill();
    ctx.strokeStyle = "#FDF8F3";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Keyhole / Dial Notch
    ctx.beginPath();
    ctx.moveTo(0, -44);
    ctx.lineTo(0, -20);
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.restore();

    // Top Pointer Indicator (Fixed Marker)
    ctx.beginPath();
    ctx.moveTo(cx, cy - 135);
    ctx.lineTo(cx - 10, cy - 150);
    ctx.lineTo(cx + 10, cy - 150);
    ctx.closePath();
    ctx.fillStyle = "#9E5D46";
    ctx.fill();
  }, [angle]);

  // Drag interaction math
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - centerRef.current.x;
    const y = e.clientY - rect.top - centerRef.current.y;
    const rad = Math.atan2(y, x);
    let deg = (rad * 180) / Math.PI + 90;
    updateAngle(deg);
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <section id="cerrojo-boveda" className="py-24 bg-[#F7EDE4]/60 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-semibold text-[#3D3229] tracking-tight">
            El Cerrojo Físico de Bóveda
          </h2>
          <p className="font-sans text-base sm:text-lg text-[#6B5D4D] leading-relaxed">
            Experimenta el mecanismo interactivo de seguridad. Gira el dial o pulsa los pasos para desbloquear una cápsula de herencia protegida.
          </p>
        </div>

        {/* Main Vault Interactive Board */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center max-w-6xl mx-auto">
          
          {/* Left Dial Controls */}
          <div className="lg:col-span-6 bg-white rounded-[36px] p-8 border border-[#F7EDE4] shadow-2xl flex flex-col items-center justify-center space-y-6">
            <div className="flex items-center justify-between w-full border-b border-[#F7EDE4] pb-4">
              <span className="text-xs font-mono text-[#9B8B7A] uppercase tracking-wider">
                Controlador de Combinación 3D
              </span>
              <button
                onClick={resetVault}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#9E5D46] hover:underline"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reiniciar
              </button>
            </div>

            {/* Interactive Canvas Dial */}
            <div className="relative cursor-grab active:cursor-grabbing touch-none select-none">
              <canvas
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className="w-[280px] h-[280px] sm:w-[300px] sm:h-[300px]"
              />
            </div>

            {/* Step Quick Controls */}
            <div className="grid grid-cols-3 gap-2 w-full pt-2">
              <button
                onClick={() => rotateStepManually(90)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                  stepProgress >= 1
                    ? "bg-[#9CAF88] text-white"
                    : "bg-[#F7EDE4] text-[#6B5D4D] hover:bg-[#E8EDE5]"
                }`}
              >
                1. Grabar (90°)
              </button>
              <button
                onClick={() => rotateStepManually(180)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                  stepProgress >= 2
                    ? "bg-[#B8A9C9] text-[#3D3229]"
                    : "bg-[#F7EDE4] text-[#6B5D4D] hover:bg-[#E8EDE5]"
                }`}
              >
                2. Heredero (180°)
              </button>
              <button
                onClick={() => rotateStepManually(270)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                  stepProgress >= 3
                    ? "bg-[#9E5D46] text-white"
                    : "bg-[#F7EDE4] text-[#6B5D4D] hover:bg-[#E8EDE5]"
                }`}
              >
                3. Abrir (270°)
              </button>
            </div>
          </div>

          {/* Right Vault Door Status / Unlocked Scroll */}
          <div className="lg:col-span-6">
            <div className="bg-[#3D3229] text-[#FDF8F3] rounded-[36px] p-8 border border-[#3D3229] shadow-2xl space-y-6 relative overflow-hidden min-h-[420px] flex flex-col justify-between">
              
              {/* Status Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  {isUnlocked ? (
                    <Unlock className="w-6 h-6 text-amber-300 animate-bounce" />
                  ) : (
                    <Lock className="w-6 h-6 text-rose-300" />
                  )}
                  <div>
                    <h3 className="font-serif font-bold text-lg text-white">
                      {isUnlocked ? "Bóveda Desbloqueada" : "Bóveda Encriptada"}
                    </h3>
                    <p className="text-xs text-amber-100/70">
                      {isUnlocked ? "Acceso concedido a herederos" : "Arrastra el dial o pulsa las fases"}
                    </p>
                  </div>
                </div>

                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  isUnlocked ? "bg-emerald-500 text-white" : "bg-white/10 text-amber-200"
                }`}>
                  {isUnlocked ? "ABIERTO" : `FASE ${stepProgress}/3`}
                </span>
              </div>

              {/* Body Content inside Vault Door */}
              {!isUnlocked ? (
                <div className="space-y-4 my-auto">
                  <div className="space-y-3">
                    <div className={`p-4 rounded-2xl border transition-all ${
                      stepProgress >= 1 ? "bg-white/15 border-amber-300/50" : "bg-white/5 border-white/10"
                    }`}>
                      <h4 className="font-semibold text-sm text-white flex items-center gap-2">
                        <CheckCircle2 className={`w-4 h-4 ${stepProgress >= 1 ? "text-amber-300" : "text-white/30"}`} />
                        Fase 1: Registrar Audio & Fotos Diarias
                      </h4>
                      <p className="text-xs text-amber-100/70 mt-1">Gira el dial a 90° o presiona la opción 1.</p>
                    </div>

                    <div className={`p-4 rounded-2xl border transition-all ${
                      stepProgress >= 2 ? "bg-white/15 border-amber-300/50" : "bg-white/5 border-white/10"
                    }`}>
                      <h4 className="font-semibold text-sm text-white flex items-center gap-2">
                        <CheckCircle2 className={`w-4 h-4 ${stepProgress >= 2 ? "text-amber-300" : "text-white/30"}`} />
                        Fase 2: Asignar Heredero (Sofía M. - Hija)
                      </h4>
                      <p className="text-xs text-amber-100/70 mt-1">Gira el dial a 180° o presiona la opción 2.</p>
                    </div>

                    <div className={`p-4 rounded-2xl border transition-all ${
                      stepProgress >= 3 ? "bg-white/15 border-amber-300/50" : "bg-white/5 border-white/10"
                    }`}>
                      <h4 className="font-semibold text-sm text-white flex items-center gap-2">
                        <CheckCircle2 className={`w-4 h-4 ${stepProgress >= 3 ? "text-amber-300" : "text-white/30"}`} />
                        Fase 3: Verificación de Código OTP
                      </h4>
                      <p className="text-xs text-amber-100/70 mt-1">Gira el dial a 270° o presiona la opción 3.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4 my-auto p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-amber-300/30"
                >
                  <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-widest">
                    <Sparkles className="w-4 h-4" /> Pergamino de Legado Liberado
                  </div>

                  <h4 className="font-serif font-semibold text-xl text-white">
                    "Para mi querida hija Sofía: Este es el día que esperé toda mi vida..."
                  </h4>

                  <p className="font-sans text-sm text-amber-50/90 leading-relaxed italic">
                    "He guardado mi voz y cada recuerdo en Recall.bio para que nunca olvides cuánto te amo y de dónde vienes."
                  </p>

                  <div className="pt-2">
                    <Link
                      href="/es/auth/signup"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#9E5D46] hover:bg-[#854B36] text-white font-semibold text-sm transition-all"
                    >
                      <span>Crear mi bóveda protegida hoy</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* Bottom security footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-amber-100/60">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Supabase RLS Protected
                </span>
                <span>Algoritmo AES-256</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
