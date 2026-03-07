"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { pressVariants } from "./animations";

interface GlowButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  glow?: boolean; // Kept for backwards compatibility but unused
}

export function GlowButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  variant = "primary",
  className = "",
  glow = false,
}: GlowButtonProps) {
  const baseStyles = "px-6 py-3 rounded-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary: "bg-[var(--primary-terracotta)] text-white hover:bg-[var(--primary-clay)]",
    secondary: "bg-[var(--accent-sage)] text-white hover:bg-[#8A9D78]",
    ghost: "bg-transparent border border-[var(--primary-terracotta)] text-[var(--primary-terracotta)] hover:bg-[var(--primary-terracotta)]/10",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      variants={pressVariants}
      initial="rest"
      whileHover="hover"
      whileTap="press"
    >
      <span className="relative z-10 flex items-center justify-center gap-2 w-full h-full">
        {children}
      </span>
    </motion.button>
  );
}
