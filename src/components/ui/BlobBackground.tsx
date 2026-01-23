"use client";

import { useState, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { floatVariants } from "./animations";

interface BlobBackgroundProps {
  count?: number;
  className?: string;
}

// Función determinística para generar valores pseudoaleatorios basados en seed
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function BlobBackground({ count = 3, className = "" }: BlobBackgroundProps) {
  const [isMounted, setIsMounted] = useState(false);

  useLayoutEffect(() => {
    // Set mounted state to avoid hydration mismatch in Next.js
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const blobs = Array.from({ length: count }, (_, i) => {
    // Usar el índice como seed para valores determinísticos
    const seed = i * 137.508; // Número áureo multiplicado para mejor distribución
    return {
      id: i,
      color: i % 3 === 0 ? "var(--blob-peach)" : i % 3 === 1 ? "var(--blob-sage)" : "var(--blob-lavender)",
      size: Math.round((200 + seededRandom(seed) * 150) * 100) / 100, // Redondear a 2 decimales
      x: Math.round(seededRandom(seed + 1) * 100 * 100) / 100,
      y: Math.round(seededRandom(seed + 2) * 100 * 100) / 100,
      delay: i * 0.5,
      duration: Math.round((8 + seededRandom(seed + 3) * 4) * 100) / 100,
    };
  });

  // No renderizar en el servidor para evitar hydration mismatch
  if (!isMounted) {
    return <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} />;
  }

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {blobs.map((blob) => (
        <motion.div
          key={blob.id}
          className="absolute rounded-full blur-3xl opacity-40"
          style={{
            width: `${blob.size}px`,
            height: `${blob.size}px`,
            left: `${blob.x}%`,
            top: `${blob.y}%`,
            backgroundColor: blob.color,
            transform: "translate(-50%, -50%)",
          }}
          variants={floatVariants}
          initial="animate"
          animate="animate"
          transition={{
            delay: blob.delay,
            duration: blob.duration,
          }}
        />
      ))}
    </div>
  );
}
