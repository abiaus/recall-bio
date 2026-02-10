"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { FileText } from "lucide-react";
import { retryMemoryTranscriptionAction } from "@/server/actions/transcription";

interface TranscriptDisplayProps {
  memoryId: string;
  status: "pending" | "processing" | "completed" | "failed" | null;
  transcript: string | null;
  onRetrySuccess?: () => void | Promise<void>;
}

export function TranscriptDisplay({
  memoryId,
  status,
  transcript,
  onRetrySuccess,
}: TranscriptDisplayProps) {
  const t = useTranslations("memories");
  const [isPending, startTransition] = useTransition();
  const [retryMessage, setRetryMessage] = useState<string | null>(null);

  if (!status) {
    return null;
  }

  const statusText =
    status === "pending"
      ? t("transcriptPending")
      : status === "processing"
        ? t("transcriptProcessing")
        : status === "failed"
          ? t("transcriptFailed")
          : null;

  const shouldShowText = status === "completed" && Boolean(transcript?.trim());
  const canRetry = status === "failed";

  const handleRetry = () => {
    setRetryMessage(null);
    startTransition(async () => {
      const result = await retryMemoryTranscriptionAction(memoryId);
      if (result.success && result.queued) {
        setRetryMessage(t("transcriptRetryQueued"));
        if (onRetrySuccess) {
          await onRetrySuccess();
        }
      } else {
        setRetryMessage(result.error || t("transcriptRetryError"));
      }
    });
  };

  return (
    <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-[var(--bg-warm)] p-6 md:p-8">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary-terracotta)] to-[var(--primary-clay)] text-white flex items-center justify-center">
          <FileText className="w-5 h-5" />
        </div>
        <h3 className="font-medium text-[var(--text-primary)]">{t("transcriptTitle")}</h3>
      </div>

      {shouldShowText ? (
        <p className="text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">
          {transcript}
        </p>
      ) : (
        <div className="space-y-3">
          <p className="text-[var(--text-muted)]">
            {statusText || t("transcriptUnavailable")}
          </p>
          {canRetry && (
            <button
              type="button"
              onClick={handleRetry}
              disabled={isPending}
              className="inline-flex items-center min-h-[44px] rounded-xl px-4 py-2 bg-[var(--primary-terracotta)] text-white text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-terracotta)] focus-visible:ring-offset-2 cursor-pointer"
            >
              {isPending ? t("transcriptRetrying") : t("transcriptRetry")}
            </button>
          )}
          {retryMessage && (
            <p className="text-sm text-[var(--text-muted)]">{retryMessage}</p>
          )}
        </div>
      )}
    </div>
  );
}
