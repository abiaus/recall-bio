"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { ArrowLeft, Quote, Calendar, Music2 } from "lucide-react";
import { TranscriptDisplay } from "./TranscriptDisplay";
import { MemoryImageGallery } from "./MemoryImageGallery";

interface Question {
    text: string;
    text_es?: string | null;
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

const moodConfig: Record<string, { emoji: string; label: string; color: string }> = {
    happy: { emoji: "😊", label: "Happy", color: "from-amber-400 to-orange-400" },
    grateful: { emoji: "🙏", label: "Grateful", color: "from-emerald-400 to-teal-400" },
    contemplative: { emoji: "🤔", label: "Contemplative", color: "from-indigo-400 to-purple-400" },
    nostalgic: { emoji: "💭", label: "Nostalgic", color: "from-rose-400 to-pink-400" },
    peaceful: { emoji: "😌", label: "Peaceful", color: "from-sky-400 to-cyan-400" },
    excited: { emoji: "🎉", label: "Excited", color: "from-yellow-400 to-amber-400" },
    sad: { emoji: "😢", label: "Sad", color: "from-blue-500 to-indigo-600" },
    anxious: { emoji: "😰", label: "Anxious", color: "from-yellow-500 to-orange-500" },
    stressed: { emoji: "😓", label: "Stressed", color: "from-red-500 to-orange-600" },
    angry: { emoji: "😠", label: "Angry", color: "from-red-600 to-red-800" },
    lonely: { emoji: "😔", label: "Lonely", color: "from-gray-500 to-gray-700" },
    tired: { emoji: "😴", label: "Tired", color: "from-slate-500 to-slate-700" },
};

export function MemoryDetail({ memory }: MemoryDetailProps) {
    const t = useTranslations("memories");
    const tMood = useTranslations("today");
    const locale = useLocale();
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [transcript, setTranscript] = useState<string | null>(null);
    const [transcriptStatus, setTranscriptStatus] = useState<
        "pending" | "processing" | "completed" | "failed" | null
    >(null);
    const [isAudioLoading, setIsAudioLoading] = useState(true);
    const supabase = useMemo(() => createClient(), []);

    const loadAudio = useCallback(async () => {
        setIsAudioLoading(true);
        const { data: media } = await supabase
            .schema("public")
            .from("memory_media")
            .select("storage_path, storage_bucket, transcript, transcript_status")
            .eq("memory_id", memory.id)
            .eq("kind", "audio")
            .maybeSingle();

        if (media) {
            setTranscript(media.transcript || null);
            setTranscriptStatus(media.transcript_status || null);
            const { data } = await supabase.storage
                .from(media.storage_bucket)
                .createSignedUrl(media.storage_path, 3600);

            if (data?.signedUrl) {
                setAudioUrl(data.signedUrl);
            }
        }
        setIsAudioLoading(false);
    }, [memory.id, supabase]);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            void loadAudio();
        }, 0);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [loadAudio]);

    const getQuestionText = (q: Question) => {
        if (locale === "es" && q.text_es) {
            return q.text_es;
        }
        return q.text;
    };

    const questionText = Array.isArray(memory.questions)
        ? getQuestionText(memory.questions[0])
        : memory.questions ? getQuestionText(memory.questions) : undefined;

    const formatDate = (dateString: string) => {
        const dateLocale = locale === "es" ? "es-ES" : "en-US";
        return new Date(dateString).toLocaleDateString(dateLocale, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const mood = memory.mood ? moodConfig[memory.mood] : null;

    return (
        <div className="min-h-[calc(100vh-120px)]">
            {/* Back link */}
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
            >
                <Link
                    href="/app/memories"
                    className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--primary-terracotta)] transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-terracotta)] focus-visible:ring-offset-2 rounded-md cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">{t("backToMemories")}</span>
                </Link>
            </motion.div>

            {/* Date header */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="mt-6 mb-8 flex items-center gap-3"
            >
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{formatDate(memory.created_at)}</span>
                </div>
                {mood && (
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${mood.color} text-white text-sm font-medium`}>
                        <span>{mood.emoji}</span>
                        <span>{tMood(`mood${memory.mood!.charAt(0).toUpperCase() + memory.mood!.slice(1)}`)}</span>
                    </div>
                )}
            </motion.div>

            <div className="space-y-6">
                {/* Question Card */}
                {questionText && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-terracotta)]/10 via-[var(--accent-dusty-rose)]/10 to-[var(--accent-lavender)]/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/90 to-[var(--bg-warm)]/80 backdrop-blur-sm border border-[var(--primary-terracotta)]/15 shadow-lg shadow-[var(--primary-terracotta)]/5">
                            {/* Decorative corner */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--blob-lavender)] to-transparent opacity-30 rounded-bl-full" />

                            <div className="relative p-8 md:p-10">
                                <Quote className="w-8 h-8 text-[var(--primary-terracotta)]/20 fill-[var(--primary-terracotta)]/10 mb-4" />
                                <p className="font-serif text-xl md:text-2xl text-[var(--text-primary)] leading-relaxed">
                                    {questionText}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Answer Card */}
                {memory.content_text && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="relative"
                    >
                        <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-[var(--bg-warm)] p-6 md:p-8">
                            <p className="text-[var(--text-primary)] text-lg leading-relaxed whitespace-pre-wrap">
                                {memory.content_text}
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Image Gallery */}
                <MemoryImageGallery memoryId={memory.id} />

                {/* Audio Card */}
                {(audioUrl || isAudioLoading) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="rounded-2xl bg-gradient-to-br from-[var(--bg-warm)] to-white border border-[var(--bg-warm)] p-6 md:p-8">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--accent-sage)] to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-[var(--accent-sage)]/30">
                                    <Music2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-[var(--text-primary)]">{t("audio")}</h3>
                                    <p className="text-sm text-[var(--text-muted)]">{t("audioRecording")}</p>
                                </div>
                            </div>
                            {isAudioLoading ? (
                                <div className="h-12 bg-[var(--bg-warm)] rounded-lg animate-pulse" />
                            ) : audioUrl ? (
                                <audio src={audioUrl} controls className="w-full rounded-lg" />
                            ) : null}
                        </div>
                    </motion.div>
                )}

                <TranscriptDisplay
                    memoryId={memory.id}
                    status={transcriptStatus}
                    transcript={transcript}
                    onRetrySuccess={loadAudio}
                />
            </div>
        </div>
    );
}
