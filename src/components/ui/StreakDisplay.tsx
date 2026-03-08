"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { useTranslations } from "next-intl";

interface StreakDisplayProps {
  count: number;
  isActiveToday: boolean;
  onClick?: () => void;
}

export function StreakDisplay({ count, isActiveToday, onClick }: StreakDisplayProps) {
  const tNav = useTranslations("nav");
  
  // Si no hay racha y no completó hoy, podríamos ocultarlo o mostrarlo gris (0). 
  // Lo mostramos gris para incentivar a rellenar el día
  const displayCount = count;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium text-sm transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-terracotta)] cursor-default ${
        isActiveToday
          ? "bg-[var(--primary-terracotta)]/10 text-[var(--primary-terracotta)] border border-[var(--primary-terracotta)]/20"
          : "bg-[var(--bg-warm)]/50 text-[var(--text-muted)] border border-[#D4C5B0]/30"
      }`}
      title={isActiveToday ? tNav("streakActive") : tNav("streakPending")}
    >
      <motion.div
        animate={isActiveToday ? { 
          scale: [1, 1.15, 1],
          y: [0, -2, 0]
        } : {}}
        transition={isActiveToday ? {
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        } : {}}
      >
        <Flame 
          className={`w-[18px] h-[18px] ${isActiveToday ? "fill-[var(--primary-terracotta)] text-[var(--primary-terracotta)]" : "text-[var(--text-muted)]"}`} 
          strokeWidth={isActiveToday ? 2 : 2.5}
        />
      </motion.div>
      <span className="font-semibold">{displayCount}</span>
    </motion.button>
  );
}
