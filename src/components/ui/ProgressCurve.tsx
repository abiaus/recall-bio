"use client";

import { motion } from "framer-motion";

interface ProgressCurveProps {
  steps: number;
  currentStep: number;
  className?: string;
}

export function ProgressCurve({ steps, currentStep, className = "" }: ProgressCurveProps) {
  const progress = (currentStep / (steps - 1)) * 100;

  return (
    <div className={`relative w-full h-2 ${className}`}>
      {/* Background curve */}
      <div className="absolute inset-0 bg-[#D4C5B0]/30 rounded-full" />
      
      {/* Animated progress curve */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-[var(--primary-terracotta)] to-[var(--accent-sage)] rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 100,
          duration: 0.5,
        }}
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        }}
      />

      {/* Step indicators */}
      <div className="absolute inset-0 flex items-center justify-between">
        {Array.from({ length: steps }).map((_, index) => (
          <motion.div
            key={index}
            className={`w-4 h-4 rounded-full border-2 ${
              index <= currentStep
                ? "bg-[var(--primary-terracotta)] border-[var(--primary-terracotta)]"
                : "bg-white border-[#D4C5B0]"
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: index * 0.1,
              type: "spring",
              damping: 15,
            }}
          />
        ))}
      </div>
    </div>
  );
}
