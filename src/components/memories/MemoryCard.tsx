"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

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

interface MemoryCardProps {
  memory: Memory;
}

export function MemoryCard({ memory }: MemoryCardProps) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const loadAudio = async () => {
      const { data: media } = await supabase
        .schema("recallbio")
        .from("memory_media")
        .select("storage_path, storage_bucket")
        .eq("memory_id", memory.id)
        .eq("kind", "audio")
        .maybeSingle();

      if (media) {
        const { data } = await supabase.storage
          .from(media.storage_bucket)
          .createSignedUrl(media.storage_path, 3600);

        if (data?.signedUrl) {
          setAudioUrl(data.signedUrl);
        }
      }
    };

    loadAudio();
  }, [memory.id, supabase]);

  const questionText = Array.isArray(memory.questions)
    ? memory.questions[0]?.text
    : memory.questions?.text;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const moodEmojis: Record<string, string> = {
    happy: "😊",
    grateful: "🙏",
    contemplative: "🤔",
    nostalgic: "😌",
    peaceful: "☮️",
    excited: "🎉",
  };

  return (
    <Link href={`/app/memories/${memory.id}`}>
      <div className="p-6 rounded-2xl bg-white border border-[#D4C5B0] hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
        {questionText && (
          <p className="text-sm text-[#5A4A3A] mb-2 italic">
            {questionText}
          </p>
        )}

        {memory.content_text && (
          <p className="text-[#2B241B] mb-4 line-clamp-3 flex-grow">
            {memory.content_text}
          </p>
        )}

        {audioUrl && (
          <div className="mb-4">
            <audio src={audioUrl} controls className="w-full" />
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#D4C5B0]">
          <span className="text-xs text-[#5A4A3A]">
            {formatDate(memory.created_at)}
          </span>
          {memory.mood && (
            <span className="text-xl">{moodEmojis[memory.mood] || "📝"}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
