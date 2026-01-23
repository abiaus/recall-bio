"use client";

import { motion } from "framer-motion";
import { MemoryCard } from "./MemoryCard";
import { useTranslations } from "next-intl";
import { containerVariants } from "@/components/ui/animations";

interface Question {
  text: string;
}

interface Memory {
  id: string;
  title: string | null;
  content_text: string | null;
  mood: string | null;
  prompt_date: string | null;
  created_at: string;
  questions: Question | Question[];
}

interface MemoryListProps {
  memories: Memory[];
}

export function MemoryList({ memories }: MemoryListProps) {
  const t = useTranslations("memories");

  if (memories.length === 0) {
    return (
      <motion.div
        className="text-center py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-[var(--text-secondary)] text-lg">{t("noMemories")}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {memories.map((memory) => (
        <MemoryCard key={memory.id} memory={memory} />
      ))}
    </motion.div>
  );
}
