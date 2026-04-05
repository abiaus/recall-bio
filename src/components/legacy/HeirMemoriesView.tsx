"use client";

import { motion } from "framer-motion";
import { containerVariants } from "@/components/ui/animations";
import { HeirMemoryCard } from "./HeirMemoryCard";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";

interface MemoryMedia {
  id: string;
  kind: string;
  storage_path: string;
  duration_ms: number | null;
  transcript: string | null;
}

interface Memory {
  id: string;
  title: string | null;
  content_text: string | null;
  mood: string | null;
  prompt_date: string | null;
  created_at: string;
  questions: {
    text: string;
    text_es: string | null;
  } | null;
  memory_media?: MemoryMedia[];
}

interface HeirMemoriesViewProps {
  ownerName: string;
  memories: Memory[];
  legacyId: string;
}

export function HeirMemoriesView({ ownerName, memories, legacyId }: HeirMemoriesViewProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("heirView");

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.push(`/${locale}/app/legacy`)}
          className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t("backToLegacy")}
        </button>

        <header className="mb-16 text-center">
          <BookOpen className="w-8 h-8 text-[var(--primary-terracotta)] mx-auto mb-4" />
          <motion.h1 
            className="font-serif text-4xl sm:text-5xl font-semibold text-[var(--text-primary)] mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {t("ownerMemories", { name: ownerName })}
          </motion.h1>
          <motion.p 
            className="text-[var(--text-secondary)] text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {t("subtitle")}
          </motion.p>
        </header>

        {memories.length === 0 ? (
          <div className="text-center py-24 bg-white/50 rounded-3xl border-2 border-dashed border-[#D4C5B0]">
            <p className="text-[var(--text-secondary)] text-xl font-serif italic">
              {t("noMemories")}
            </p>
          </div>
        ) : (
          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {memories.map((memory) => (
              <HeirMemoryCard 
                key={memory.id} 
                memory={memory} 
                legacyId={legacyId}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
