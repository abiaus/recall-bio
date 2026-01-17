"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";

export function AnimatedLogo() {
  const letters = "Recall".split("");

  return (
    <Link href="/app/today" className="inline-block">
      <motion.h1
        className="font-serif text-2xl tracking-tight text-[var(--text-primary)]"
        whileHover="hover"
        initial="initial"
      >
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            className="inline-block"
            variants={{
              initial: { y: 0 },
              hover: {
                y: [0, -4, 0],
                transition: {
                  delay: index * 0.05,
                  duration: 0.3,
                  ease: "easeInOut",
                },
              },
            }}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </motion.h1>
    </Link>
  );
}
