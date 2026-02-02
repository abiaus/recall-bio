"use client";

import { motion } from "framer-motion";
import { MemoryList } from "./MemoryList";
import { DownloadMemoriesButton } from "./DownloadMemoriesButton";
import { containerVariants, itemVariants } from "@/components/ui/animations";

interface Memory {
  id: string;
  title: string | null;
  content_text: string | null;
  mood: string | null;
  prompt_date: string | null;
  created_at: string;
  questions: { text: string; text_es?: string | null } | Array<{ text: string; text_es?: string | null }>;
}

interface MemoriesPageContentProps {
  title: string;
  memories: Memory[];
}

export function MemoriesPageContent({ title, memories }: MemoriesPageContentProps) {
  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <motion.h1
          variants={itemVariants}
          className="font-serif text-4xl font-bold text-[var(--text-primary)]"
        >
          {title}
        </motion.h1>
        {memories.length > 0 && (
          <motion.div variants={itemVariants}>
            <DownloadMemoriesButton />
          </motion.div>
        )}
      </div>
      <motion.div variants={itemVariants}>
        <MemoryList memories={memories} />
      </motion.div>
    </motion.div>
  );
}
