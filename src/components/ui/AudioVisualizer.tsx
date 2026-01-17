"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface AudioVisualizerProps {
  isRecording: boolean;
  audioBlob: Blob | null;
  audioUrl: string | null;
  className?: string;
}

export function AudioVisualizer({
  isRecording,
  audioBlob,
  audioUrl,
  className = "",
}: AudioVisualizerProps) {
  const [bars, setBars] = useState<number[]>([]);

  useEffect(() => {
    if (isRecording) {
      // Generate random bar heights for visualization
      const interval = setInterval(() => {
        setBars(
          Array.from({ length: 20 }, () => Math.random() * 100)
        );
      }, 100);

      return () => clearInterval(interval);
    } else {
      setBars([]);
    }
  }, [isRecording]);

  if (!isRecording && !audioUrl) {
    return null;
  }

  return (
    <div className={`flex items-center justify-center gap-1 h-12 ${className}`}>
      {bars.length > 0 ? (
        bars.map((height, index) => (
          <motion.div
            key={index}
            className="w-1 bg-[var(--primary-terracotta)] rounded-full"
            animate={{
              height: `${height}%`,
            }}
            transition={{
              duration: 0.1,
              ease: "easeOut",
            }}
            style={{
              minHeight: "8px",
            }}
          />
        ))
      ) : (
        <div className="text-[var(--text-muted)] text-sm">Audio ready</div>
      )}
    </div>
  );
}
