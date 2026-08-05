"use client";

import { useState, useLayoutEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
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
  const shouldReduceMotion = useReducedMotion();
  const variants = hover ? cardHoverVariants : itemVariants;

  useLayoutEffect(() => {
    // Set mounted state to avoid hydration mismatch in Next.js
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  return (
    <motion.div
      className={`rounded-3xl bg-white border border-[var(--bg-warm)] shadow-sm ${className}`}
      variants={shouldReduceMotion ? undefined : variants}
      initial={isMounted && !shouldReduceMotion ? "hidden" : false}
      animate={isMounted && !shouldReduceMotion ? "visible" : false}
      whileHover={hover && isMounted && !shouldReduceMotion ? "hover" : undefined}
      whileTap={hover && isMounted && !shouldReduceMotion ? "press" : undefined}
      transition={shouldReduceMotion ? { duration: 0 } : {
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
