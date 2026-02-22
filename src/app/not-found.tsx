"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BlobBackground } from "@/components/ui/BlobBackground";
import { GlowButton } from "@/components/ui/GlowButton";
import { containerVariants, itemVariants, floatVariants } from "@/components/ui/animations";
import { BookOpen } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-dvh relative overflow-hidden" style={{ background: "var(--bg-cream)" }}>
      <BlobBackground count={5} />

      <div className="relative z-10 flex items-center justify-center min-h-dvh px-4 py-16">
        <motion.div
          className="w-full max-w-2xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Número 404 grande con efecto watermark */}
          <motion.div
            variants={itemVariants}
            className="relative mb-8"
          >
            <motion.h1
              className="font-serif text-[180px] sm:text-[240px] md:text-[280px] font-bold text-[var(--text-muted)] opacity-20 select-none"
              variants={floatVariants}
              animate="animate"
              style={{
                fontFamily: "var(--font-serif)",
                lineHeight: 1,
              }}
            >
              404
            </motion.h1>
          </motion.div>

          {/* Icono decorativo flotante */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center mb-6"
          >
            <motion.div
              variants={floatVariants}
              animate="animate"
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <BookOpen
                className="w-16 h-16 sm:w-20 sm:h-20 text-[var(--primary-terracotta)] opacity-60"
                strokeWidth={1.5}
              />
            </motion.div>
          </motion.div>

          {/* Título principal */}
          <motion.h2
            variants={itemVariants}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-[var(--text-primary)] mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Lost Memory
          </motion.h2>

          {/* Subtítulo poético */}
          <motion.p
            variants={itemVariants}
            className="font-serif text-lg sm:text-xl md:text-2xl text-[var(--text-secondary)] mb-6 italic"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            This memory seems to have drifted away...
          </motion.p>

          {/* Descripción */}
          <motion.p
            variants={itemVariants}
            className="font-sans text-base sm:text-lg text-[var(--text-secondary)] mb-10 max-w-md mx-auto leading-relaxed"
          >
            The page you're looking for doesn't exist or has been moved.
          </motion.p>

          {/* Botón CTA */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center"
          >
            <Link href="/app/today">
              <GlowButton variant="primary" className="text-lg px-8 py-4">
                Return Home
              </GlowButton>
            </Link>
          </motion.div>

          {/* Enlace alternativo a la página principal */}
          <motion.div
            variants={itemVariants}
            className="mt-6"
          >
            <Link
              href="/"
              className="font-sans text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-200 underline underline-offset-4 decoration-[var(--primary-terracotta)]/30 hover:decoration-[var(--primary-terracotta)]/60"
            >
              Back to homepage
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
