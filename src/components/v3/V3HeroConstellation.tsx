"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Sparkles, Mic, Volume2, Shield, ArrowRight, RotateCcw, Compass, Lock, Star } from "lucide-react";
import Link from "next/link";

interface StarNode {
  id: string;
  x: number;
  y: number;
  z: number;
  baseRadius: number;
  title: string;
  speaker: string;
  year: string;
  mood: string;
  color: string;
  transcript: string;
  audioFreqs: number[];
  stage: "Infancia" | "Juventud" | "Maternidad" | "Sabiduría";
}

const CONSTELATION_NODES: StarNode[] = [
  {
    id: "star-1",
    x: -160,
    y: -80,
    z: 120,
    baseRadius: 7,
    title: "La primera guitarra de 1984 y el recital en Córdoba",
    speaker: "Roberto M. (Papá)",
    year: "1984",
    mood: "Nostálgico",
    color: "#9E5D46", // Terracotta
    stage: "Juventud",
    transcript:
      "Ahorré tres sueldos trabajando en el taller de mi tío para comprar esa vieja guitarra Criolla... Cuando afinamos la primera cuerda y miré a tu madre entre el público, supe que ese instante duraría toda la vida.",
    audioFreqs: [30, 65, 90, 45, 95, 75, 40, 85, 55, 100, 70, 85, 40, 60, 95],
  },
  {
    id: "star-2",
    x: 180,
    y: -120,
    z: -80,
    baseRadius: 8,
    title: "El verdadero secreto para superar días difíciles",
    speaker: "Elena R. (Mamá)",
    year: "1998",
    mood: "Gratitud",
    color: "#9CAF88", // Sage
    stage: "Maternidad",
    transcript:
      "Hijita, cuando todo parezca incierto, recuerda que los días oscuros solo están preparando el terreno para lo que florecerá después. No tengas miedo de empezar de nuevo.",
    audioFreqs: [45, 80, 60, 95, 70, 35, 85, 100, 50, 75, 90, 65, 40, 85, 70],
  },
  {
    id: "star-3",
    x: -210,
    y: 110,
    z: -40,
    baseRadius: 6,
    title: "Las tardes de domingo en el patio de la abuela",
    speaker: "Don Mateo (Abuelo)",
    year: "1972",
    mood: "Contemplativo",
    color: "#B8A9C9", // Lavender
    stage: "Sabiduría",
    transcript:
      "En la vieja casa del campo, los domingos olían a albahaca fresca y pan casero. Esos almuerzos largos no eran solo comida; eran la excusa para escucharnos sin prisa.",
    audioFreqs: [25, 55, 85, 100, 45, 90, 65, 40, 95, 80, 55, 90, 70, 45, 80],
  },
  {
    id: "star-4",
    x: 140,
    y: 100,
    z: 150,
    baseRadius: 7.5,
    title: "El primer día que te sostuve en mis brazos",
    speaker: "Gonzalo & Sofía",
    year: "2024",
    mood: "Feliz",
    color: "#D4A5A5", // Rose
    stage: "Infancia",
    transcript:
      "Eras tan pequeño que entrabas en el antebrazo de tu papá. Prometí en silencio cuidarte cada día de mi vida y enseñarte a amar con todo el corazón.",
    audioFreqs: [40, 70, 95, 50, 85, 100, 60, 90, 45, 80, 95, 70, 50, 85, 65],
  },
  {
    id: "star-5",
    x: 0,
    y: -180,
    z: 200,
    baseRadius: 9,
    title: "El viaje cruzando los Andes sin mapa ni prisa",
    speaker: "Eduardo V.",
    year: "1979",
    mood: "Aventura",
    color: "#A67B5B", // Clay Earth
    stage: "Juventud",
    transcript:
      "Nos quedamos sin gasolina cerca de la frontera y unos arrieros nos hospedaron en su rancho. Aprendí que la generosidad no depende de lo que tienes en el bolsillo.",
    audioFreqs: [35, 60, 85, 90, 55, 80, 100, 45, 75, 95, 60, 85, 40, 70, 90],
  },
];

export function V3HeroConstellation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeNode, setActiveNode] = useState<StarNode>(CONSTELATION_NODES[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [progress, setProgress] = useState(20);
  const [autoRotate, setAutoRotate] = useState(true);

  const rotationRef = useRef({ x: 0.2, y: 0.4 });
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Web Audio API harmonic chime synthesizer
  const playChimeSound = useCallback((frequency = 440) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {
      // Audio fallback
    }
  }, []);

  const handleNodeClick = (node: StarNode) => {
    setActiveNode(node);
    setIsPlaying(true);
    setProgress(0);
    playChimeSound(523.25); // C5 harmonic note
  };

  // 3D Canvas Constellation Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = 550);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 550;
    };
    window.addEventListener("resize", handleResize);

    let angleY = 0;
    let angleX = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (autoRotate && !isDraggingRef.current) {
        rotationRef.current.y += 0.003;
        rotationRef.current.x = Math.sin(Date.now() * 0.0005) * 0.15;
      }

      angleY = rotationRef.current.y;
      angleX = rotationRef.current.x;

      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      const fov = 400;
      const cx = width / 2;
      const cy = height / 2;

      // Project 3D nodes to 2D canvas screen coordinates
      const projectedNodes = CONSTELATION_NODES.map((node) => {
        // Rotate Y
        let x1 = node.x * cosY - node.z * sinY;
        let z1 = node.z * cosY + node.x * sinY;

        // Rotate X
        let y2 = node.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + node.y * sinX;

        const scale = fov / (fov + z2 + 250);
        const screenX = cx + x1 * scale;
        const screenY = cy + y2 * scale;
        const screenRadius = Math.max(3, node.baseRadius * scale);

        return {
          ...node,
          screenX,
          screenY,
          screenRadius,
          scale,
          z2,
        };
      });

      // Draw constellation connecting lines
      ctx.lineWidth = 1;
      for (let i = 0; i < projectedNodes.length; i++) {
        for (let j = i + 1; j < projectedNodes.length; j++) {
          const p1 = projectedNodes[i];
          const p2 = projectedNodes[j];

          const dist = Math.hypot(p1.screenX - p2.screenX, p1.screenY - p2.screenY);
          if (dist < 320) {
            const alpha = (1 - dist / 320) * 0.25;
            ctx.beginPath();
            ctx.moveTo(p1.screenX, p1.screenY);
            ctx.lineTo(p2.screenX, p2.screenY);
            ctx.strokeStyle = `rgba(196, 144, 124, ${alpha})`;
            ctx.stroke();
          }
        }
      }

      // Draw ambient background stardust particles
      for (let k = 0; k < 40; k++) {
        const px = (Math.sin(k * 99 + Date.now() * 0.0003) * 0.4 + 0.5) * width;
        const py = (Math.cos(k * 77 + Date.now() * 0.0002) * 0.4 + 0.5) * height;
        ctx.fillStyle = "rgba(156, 175, 136, 0.25)";
        ctx.beginPath();
        ctx.arc(px, py, (k % 3) + 1, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Star Nodes
      projectedNodes.forEach((node) => {
        const isHovered = hoveredNodeId === node.id;
        const isActive = activeNode.id === node.id;

        // Glow halo
        const glowRadius = isHovered || isActive ? node.screenRadius * 3.5 : node.screenRadius * 2;
        const gradient = ctx.createRadialGradient(
          node.screenX,
          node.screenY,
          0,
          node.screenX,
          node.screenY,
          glowRadius
        );
        gradient.addColorStop(0, `${node.color}${isActive ? "99" : "55"}`);
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.screenX, node.screenY, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Star core
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.screenX, node.screenY, isHovered || isActive ? node.screenRadius * 1.4 : node.screenRadius, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing border ring if active
        if (isActive || isHovered) {
          ctx.strokeStyle = node.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(node.screenX, node.screenY, node.screenRadius * 2, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Speaker Label
        ctx.fillStyle = "#3D3229";
        ctx.font = isHovered || isActive ? "600 13px Outfit, sans-serif" : "400 11px Outfit, sans-serif";
        ctx.fillText(node.speaker, node.screenX + node.screenRadius + 8, node.screenY + 4);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [hoveredNodeId, activeNode, autoRotate]);

  // Mouse / Touch Rotation Drag Controls
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    setAutoRotate(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    rotationRef.current.y += dx * 0.005;
    rotationRef.current.x += dy * 0.005;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <section className="relative overflow-hidden pt-10 pb-20 md:pt-14 md:pb-28 bg-[#FDF8F3]">
      {/* Ambient Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl h-[600px] bg-gradient-to-b from-[#F7EDE4]/80 via-[#FDF8F3] to-transparent rounded-[64px] -z-10 pointer-events-none blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F7EDE4] border border-[#E8EDE5]">
            <Sparkles className="w-4 h-4 text-[#9E5D46]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#3D3229]">
              Experiencia 3D Espacial • El Telar Holográfico de Voces
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-semibold text-[#3D3229] leading-[1.1] tracking-tight">
            La voz de quien amas resuena viva en el tiempo.
          </h1>

          <p className="font-sans text-lg sm:text-xl text-[#6B5D4D] max-w-2xl mx-auto leading-relaxed">
            Navega por la constelación holográfica de memorias. Haz clic en cualquier nodo para escuchar voces reales preservadas en la bóveda de Recall.bio.
          </p>
        </div>

        {/* 3D Constellation Canvas & Holographic Console Container */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left / Center 3D Space Canvas */}
          <div className="lg:col-span-7 relative bg-white/60 backdrop-blur-xl rounded-[36px] border border-[#F7EDE4] shadow-2xl p-4 overflow-hidden group">
            
            <div className="absolute top-4 left-6 z-10 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-semibold text-[#3D3229]">
                Espacio 3D Interactivo (Arrastra para rotar)
              </span>
            </div>

            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className="absolute top-4 right-6 z-10 text-xs font-medium bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#F7EDE4] text-[#6B5D4D] hover:text-[#9E5D46] transition-colors"
            >
              {autoRotate ? "Pausar rotación 3D" : "Reanudar rotación 3D"}
            </button>

            {/* 3D Canvas element */}
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="w-full h-[500px] cursor-grab active:cursor-grabbing rounded-[28px]"
            />

            {/* Quick Star Selector Pills under Canvas */}
            <div className="flex flex-wrap gap-2 p-3 bg-[#FDF8F3]/90 rounded-2xl border border-[#F7EDE4] mt-2">
              <span className="text-xs font-semibold text-[#9B8B7A] self-center mr-1">
                Seleccionar nodo:
              </span>
              {CONSTELATION_NODES.map((node) => (
                <button
                  key={node.id}
                  onClick={() => handleNodeClick(node)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-xl transition-all ${
                    activeNode.id === node.id
                      ? "bg-[#9E5D46] text-white shadow-sm"
                      : "bg-white text-[#6B5D4D] hover:bg-[#F7EDE4]"
                  }`}
                >
                  {node.speaker}
                </button>
              ))}
            </div>
          </div>

          {/* Right Floating Holographic Voice Detail Console */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-[36px] p-6 sm:p-8 border border-[#F7EDE4] shadow-2xl space-y-6 relative overflow-hidden">
              
              {/* Top Accent Line */}
              <div
                className="h-2 w-full absolute top-0 left-0 transition-all duration-500"
                style={{ backgroundColor: activeNode.color }}
              />

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-semibold text-[#9E5D46] bg-[#9E5D46]/10 px-3 py-1 rounded-full">
                  Etapa: {activeNode.stage}
                </span>
                <span className="text-xs font-mono text-[#9B8B7A]">
                  Año {activeNode.year}
                </span>
              </div>

              <div>
                <h3 className="font-serif font-semibold text-2xl text-[#3D3229] leading-snug">
                  "{activeNode.title}"
                </h3>
                <p className="text-xs font-medium text-[#6B5D4D] mt-1">
                  Voz preservada de <strong className="text-[#3D3229]">{activeNode.speaker}</strong>
                </p>
              </div>

              {/* Audio Waveform Interactive Player */}
              <div className="p-5 rounded-2xl bg-[#FDF8F3] border border-[#F7EDE4] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-[#9E5D46]" />
                    <span className="text-xs font-semibold text-[#3D3229]">
                      Audio de Alta Fidelidad
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setIsPlaying(!isPlaying);
                      playChimeSound(440);
                    }}
                    className="w-12 h-12 rounded-2xl bg-[#9E5D46] hover:bg-[#854B36] text-white flex items-center justify-center shadow-md active:scale-95 transition-all"
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                  </button>
                </div>

                {/* Animated Waveform */}
                <div className="h-12 flex items-end gap-1 px-2 py-1 bg-white rounded-xl border border-[#F7EDE4]">
                  {activeNode.audioFreqs.map((freq, i) => {
                    const animatedH = isPlaying ? Math.min(100, Math.max(25, freq * (0.6 + Math.random() * 0.6))) : freq * 0.4;
                    return (
                      <div
                        key={i}
                        className="flex-1 rounded-full transition-all duration-200"
                        style={{
                          height: `${animatedH}%`,
                          backgroundColor: activeNode.color,
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Gemini AI Transcript Display */}
              <div className="p-5 rounded-2xl bg-[#3D3229] text-[#FDF8F3] space-y-2">
                <div className="flex items-center justify-between text-[11px] text-amber-200/90 font-mono">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Transcripción Gemini IA
                  </span>
                  <span>Sincronizado</span>
                </div>
                <p className="font-sans text-sm leading-relaxed text-amber-50/90 italic">
                  "{activeNode.transcript}"
                </p>
              </div>

              {/* CTA Action */}
              <div className="pt-2">
                <Link
                  href="/es/auth/signup"
                  className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-[#9E5D46] hover:bg-[#854B36] text-white font-semibold text-base transition-all shadow-md active:scale-95"
                >
                  <Mic className="w-5 h-5 text-amber-200" />
                  <span>Crear mi constelación de memorias</span>
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
