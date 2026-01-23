"use client";

import { useState, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cardHoverVariants, itemVariants } from "./animations";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
}

export function AnimatedCard({ 
  children, 
  className = "", 
  delay = 0,
  hover = true 
}: AnimatedCardProps) {
  const [isMounted, setIsMounted] = useState(false);
  const variants = hover ? cardHoverVariants : itemVariants;

  useLayoutEffect(() => {
    // Set mounted state to avoid hydration mismatch in Next.js
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  return (
    <motion.div
      className={`rounded-xl bg-white/80 backdrop-blur-sm border border-[#D4C5B0]/30 ${className}`}
      variants={variants}
      initial={isMounted ? "hidden" : false}
      animate={isMounted ? "visible" : false}
      whileHover={hover && isMounted ? "hover" : undefined}
      whileTap={hover && isMounted ? "press" : undefined}
      transition={{
        delay,
        type: "spring",
        damping: 20,
        stiffness: 100,
      }}
      suppressHydrationWarning
    >
      {children}
    </motion.div>
  );
}
