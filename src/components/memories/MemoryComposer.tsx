"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { AudioRecorder } from "@/components/recording/AudioRecorder";

interface MemoryComposerProps {
  questionId: string;
}

export function MemoryComposer({ questionId }: MemoryComposerProps) {
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);
  const [savedMemoryId, setSavedMemoryId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    const { data: memory, error } = await supabase
      .schema("recallbio")
      .from("memories")
      .insert({
        user_id: user.id,
        question_id: questionId,
        prompt_date: today,
        content_text: content,
        mood: mood || null,
        is_private: true,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error saving memory:", error);
      setLoading(false);
    } else {
      setSavedMemoryId(memory.id);
      if (!content.trim()) {
        // If only audio, keep form open for text
        setLoading(false);
      } else {
        setContent("");
        setMood("");
        router.refresh();
        setLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-[#2B241B] mb-2"
        >
          Tu respuesta
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={6}
          className="w-full px-4 py-2 rounded-lg border border-[#D4C5B0] bg-white text-[#2B241B] focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-transparent resize-none"
          placeholder="Escribe tu respuesta aquí..."
        />
      </div>

      <div>
        <label
          htmlFor="mood"
          className="block text-sm font-medium text-[#2B241B] mb-2"
        >
          Estado de ánimo (opcional)
        </label>
        <select
          id="mood"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-[#D4C5B0] bg-white text-[#2B241B] focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-transparent"
        >
          <option value="">Selecciona...</option>
          <option value="happy">Feliz</option>
          <option value="grateful">Agradecido</option>
          <option value="contemplative">Contemplativo</option>
          <option value="nostalgic">Nostálgico</option>
          <option value="peaceful">Tranquilo</option>
          <option value="excited">Emocionado</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading || (!content.trim() && !savedMemoryId)}
        className="px-6 py-3 rounded-lg bg-[#8B7355] text-white font-medium hover:bg-[#7A6345] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Guardando..." : "Guardar Recuerdo"}
      </button>

      {savedMemoryId && (
        <div className="mt-4 p-4 rounded-lg bg-[#F6F1E7] border border-[#D4C5B0]">
          <p className="text-sm text-[#5A4A3A] mb-2">
            Recuerdo guardado. Puedes agregar un audio si lo deseas:
          </p>
          <AudioRecorder
            memoryId={savedMemoryId}
            onUploadComplete={() => {
              router.refresh();
            }}
          />
        </div>
      )}
    </form>
  );
}
