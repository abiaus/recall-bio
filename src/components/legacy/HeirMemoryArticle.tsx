"use client";

import { motion } from "framer-motion";
import { itemVariants } from "@/components/ui/animations";
import { useLocale } from "next-intl";
import ReactMarkdown from "react-markdown";

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

export function HeirMemoryArticle({ memory, isFirst = false }: { memory: Memory; isFirst?: boolean }) {
  const locale = useLocale() as "en" | "es";
  
  const dateObj = memory.prompt_date ? new Date(memory.prompt_date) : new Date(memory.created_at);
  const formattedDate = new Intl.DateTimeFormat(locale, {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(dateObj);
    
  const questionText = locale === "es" && memory.questions?.text_es 
    ? memory.questions.text_es 
    : memory.questions?.text;

  // Find transcript if there's any audio media
  const audioMedia = memory.memory_media?.find(m => m.kind === 'audio' || m.kind === 'audio/webm');
  const transcript = audioMedia?.transcript;

  const content = memory.content_text || transcript || "";

  return (
    <motion.article 
      variants={itemVariants}
      className={`relative ${!isFirst ? "pt-16 border-t border-[var(--border-light)]" : ""}`}
    >
      <div className="absolute -left-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--border-light)] to-transparent hidden md:block" />
      
      <div className="mb-8">
        <time className="text-sm tracking-wide text-[var(--primary-sage)] uppercase font-semibold mb-3 block">
          {formattedDate}
        </time>
        
        {memory.title && (
          <h2 className="font-serif text-3xl font-bold text-[var(--text-primary)] mb-4 leading-tight">
            {memory.title}
          </h2>
        )}

        {questionText && (
          <blockquote className="font-serif text-xl sm:text-2xl italic text-[var(--text-secondary)] border-l-4 border-[var(--primary-terracotta)] pl-6 py-2 my-6">
            &ldquo;{questionText}&rdquo;
          </blockquote>
        )}
      </div>

      <div className="prose prose-lg prose-p:text-[var(--text-primary)] prose-p:leading-relaxed font-serif max-w-none">
        {content ? (
          <ReactMarkdown
            components={{
              p: ({ node, ...props }) => <p className="mb-6 last:mb-0" {...props} />
            }}
          >
            {content}
          </ReactMarkdown>
        ) : (
           <p className="italic text-[var(--text-muted)]">No text available for this memory.</p>
        )}
      </div>
      
      {/* If there are images, we could render them here */}
      {memory.memory_media && memory.memory_media.some(m => m.kind !== 'audio' && m.kind !== 'audio/webm') && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {memory.memory_media.filter(m => m.kind !== 'audio' && m.kind !== 'audio/webm').map((media) => (
             /* To render the true image we would need the signed URL or public URL.
                For now we show a placeholder indicating an image exists, or fetch it if public. 
                Assuming storage is private, we would need a component to fetch signed URLs like MemoryGallery. */
             <div key={media.id} className="aspect-square bg-[var(--background-secondary)] rounded-xl overflow-hidden relative">
               <div className="absolute inset-0 flex items-center justify-center text-[var(--text-muted)] text-sm">
                  [ Attached Media ]
               </div>
             </div>
          ))}
        </div>
      )}
    </motion.article>
  );
}
