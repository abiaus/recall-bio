"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
  alpha: number;
}

interface AuroraOrb {
  x: number;
  y: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
}

export function V3AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Large Vibrant Aurora Orbs
    const orbs: AuroraOrb[] = [
      { x: width * 0.25, y: height * 0.25, radius: 380, color: "rgba(224, 122, 95, 0.45)", vx: 0.5, vy: 0.3 },
      { x: width * 0.75, y: height * 0.5, radius: 420, color: "rgba(129, 178, 154, 0.4)", vx: -0.4, vy: 0.4 },
      { x: width * 0.4, y: height * 0.8, radius: 350, color: "rgba(242, 204, 143, 0.35)", vx: 0.4, vy: -0.3 },
      { x: width * 0.8, y: height * 0.2, radius: 360, color: "rgba(184, 169, 201, 0.35)", vx: -0.3, vy: -0.4 },
    ];

    // Bright Glowing Stardust Particles
    const particles: Particle[] = Array.from({ length: 80 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 3 + 1.5,
      color: Math.random() > 0.5 ? "#E07A5F" : Math.random() > 0.5 ? "#F2CC8F" : "#81B29A",
      vx: (Math.random() - 0.5) * 0.5,
      vy: -Math.random() * 0.6 - 0.2,
      alpha: Math.random() * 0.8 + 0.2,
    }));

    let step = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      step += 0.015;

      // Draw Dark Deep Canvas Base
      ctx.fillStyle = "#16110E";
      ctx.fillRect(0, 0, width, height);

      // Render Aurora Orbs
      orbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x < -150 || orb.x > width + 150) orb.vx *= -1;
        if (orb.y < -150 || orb.y > height + 150) orb.vy *= -1;

        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        grad.addColorStop(0, orb.color);
        grad.addColorStop(0.7, orb.color.replace(/[\d\.]+\)$/, "0.15)"));
        grad.addColorStop(1, "transparent");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render Stardust Particles
      particles.forEach((p) => {
        p.y += p.vy;
        p.x += Math.sin(step + p.y * 0.01) * 0.5;

        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
    />
  );
}
