"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

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

interface MemoryDetailProps {
  memory: Memory;
}

export function MemoryDetail({ memory }: MemoryDetailProps) {
  const t = useTranslations("memories");
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
      hour: "2-digit",
      minute: "2-digit",
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
    <div className="space-y-6">
      <Link
        href="/app/memories"
        className="text-[#8B7355] hover:underline text-sm"
      >
        ← {t("backToMemories")}
      </Link>

      <div className="space-y-4">
        {questionText && (
          <div className="p-6 rounded-2xl bg-[#F6F1E7] border border-[#D4C5B0]">
            <p className="font-serif text-xl text-[#2B241B] italic">
              {questionText}
            </p>
          </div>
        )}

        {memory.content_text && (
          <div className="p-6 rounded-2xl bg-white border border-[#D4C5B0]">
            <p className="text-[#2B241B] whitespace-pre-wrap leading-relaxed">
              {memory.content_text}
            </p>
          </div>
        )}

        {audioUrl && (
          <div className="p-6 rounded-2xl bg-white border border-[#D4C5B0]">
            <h3 className="font-medium text-[#2B241B] mb-2">{t("audio")}</h3>
            <audio src={audioUrl} controls className="w-full" />
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-[#5A4A3A]">
          <span>{formatDate(memory.created_at)}</span>
          {memory.mood && (
            <span className="text-2xl">
              {moodEmojis[memory.mood] || "📝"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
