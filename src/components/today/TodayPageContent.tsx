"use client";

import { MemoryComposer } from "@/components/memories/MemoryComposer";
import { TodayHero } from "@/components/today/TodayHero";
import { NewPromptButton } from "@/components/today/NewPromptButton";

interface TodayPageContentProps {
  title: string;
  prompt: { text: string; question_id: string } | null;
  canRequestNewPrompt: boolean;
  noPromptsText: string;
}

export function TodayPageContent({
  title,
  prompt,
  canRequestNewPrompt,
  noPromptsText,
}: TodayPageContentProps) {
  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col">
      {prompt ? (
        <>
          <TodayHero 
            promptText={prompt.text} 
            canRequestNewPrompt={canRequestNewPrompt}
          />
          <div className="flex-1 mt-8">
            <MemoryComposer questionId={prompt.question_id} />
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-6 max-w-md mx-auto px-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[var(--blob-peach)] to-[var(--blob-lavender)] flex items-center justify-center">
              <span className="text-4xl">✨</span>
            </div>
            <div>
              <h2 className="font-serif text-2xl text-[var(--text-primary)] mb-2">
                {title}
              </h2>
              <p className="text-[var(--text-secondary)]">{noPromptsText}</p>
            </div>
            {canRequestNewPrompt && <NewPromptButton hasExistingPrompt={false} />}
          </div>
        </div>
      )}
    </div>
  );
}
