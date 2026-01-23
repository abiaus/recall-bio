"use client";

import { motion } from "framer-motion";

interface LifeStageCardProps {
  value: string;
  label: string;
  icon: React.ReactNode;
  selected: boolean;
  onSelect: (value: string) => void;
}

export function LifeStageCard({
  value,
  label,
  icon,
  selected,
  onSelect,
}: LifeStageCardProps) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(value)}
      className={`relative p-6 rounded-3xl border-2 transition-all w-full ${
        selected
          ? "border-[var(--primary-terracotta)] bg-[var(--primary-terracotta)]/10 shadow-lg"
          : "border-[#D4C5B0] bg-white/80 hover:border-[var(--primary-terracotta)]/50"
      }`}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      {selected && (
        <motion.div
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[var(--primary-terracotta)] flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div
            className="w-3 h-3 rounded-full bg-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
          />
        </motion.div>
      )}
      
      <div className="flex flex-col items-center gap-3">
        <motion.div
          className={`p-4 rounded-2xl ${
            selected
              ? "bg-gradient-to-br from-[var(--primary-terracotta)] to-[var(--accent-dusty-rose)]"
              : "bg-[var(--bg-warm)]"
          }`}
          animate={selected ? { rotate: [0, 5, -5, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className={`${selected ? "text-white" : "text-[var(--text-secondary)]"}`}>
            {icon}
          </div>
        </motion.div>
        <span className={`font-medium ${selected ? "text-[var(--primary-terracotta)]" : "text-[var(--text-secondary)]"}`}>
          {label}
        </span>
      </div>
    </motion.button>
  );
}
