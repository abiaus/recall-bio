"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { containerVariants } from "@/components/ui/animations";
import { HeirMemoryArticle } from "./HeirMemoryArticle";
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
}

export function HeirMemoriesView({ ownerName, memories }: HeirMemoriesViewProps) {
  const router = useRouter();
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.push(`/${locale}/app/legacy`)}
          className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Legacy
        </button>

        <header className="mb-16 text-center">
          <BookOpen className="w-8 h-8 text-[var(--primary-terracotta)] mx-auto mb-4" />
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[var(--text-primary)] mb-4">
            {ownerName}&apos;s Memories
          </h1>
          <p className="text-[var(--text-secondary)] text-lg">
            A digital legacy preserved for you.
          </p>
        </header>

        {memories.length === 0 ? (
          <div className="text-center py-12 border-t border-[var(--border-light)]">
            <p className="text-[var(--text-secondary)]">No memories have been documented yet.</p>
          </div>
        ) : (
          <motion.div
            className="space-y-24"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {memories.map((memory, index) => (
              <HeirMemoryArticle key={memory.id} memory={memory} isFirst={index === 0} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
