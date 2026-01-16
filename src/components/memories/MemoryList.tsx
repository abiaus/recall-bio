"use client";

import { MemoryCard } from "./MemoryCard";

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
  if (memories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#5A4A3A]">
          Aún no tienes recuerdos guardados. Comienza respondiendo tu prompt
          del día.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {memories.map((memory) => (
        <MemoryCard key={memory.id} memory={memory} />
      ))}
    </div>
  );
}
