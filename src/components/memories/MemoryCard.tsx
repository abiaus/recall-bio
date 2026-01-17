"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { MoodBadge } from "@/components/ui/MoodBadge";
import { itemVariants } from "@/components/ui/animations";

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

interface MemoryCardProps {
    memory: Memory;
}

export function MemoryCard({ memory }: MemoryCardProps) {
    const t = useTranslations("memories");
    const locale = useLocale();
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const loadAudio = async () => {
            const { data: media } = await supabase
                .schema("public")
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
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Generate a subtle variation in border radius for organic feel
    const borderRadiusVariations = [
        "rounded-[2rem]",
        "rounded-[2.2rem]",
        "rounded-[1.8rem]",
        "rounded-[2.1rem]",
    ];
    const randomBorderRadius = borderRadiusVariations[memory.id.charCodeAt(0) % borderRadiusVariations.length];

    return (
        <motion.div variants={itemVariants}>
            <Link href={`/app/memories/${memory.id}`}>
                <AnimatedCard
                    className={`p-6 h-full flex flex-col relative overflow-hidden ${randomBorderRadius}`}
                    hover={true}
                >
                    {/* Subtle paper texture overlay */}
                    <div
                        className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                    />

                    {/* Decorative blob */}
                    <motion.div
                        className="absolute top-0 right-0 w-24 h-24 bg-[var(--blob-peach)] rounded-full blur-2xl opacity-20"
                        animate={{
                            scale: [1, 1.2, 1],
                            x: [0, 10, 0],
                            y: [0, -10, 0],
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />

                    <div className="relative z-10 flex flex-col h-full">
                        {questionText && (
                            <motion.p
                                className="text-sm text-[var(--text-secondary)] mb-3 italic font-serif"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                            >
                                "{questionText}"
                            </motion.p>
                        )}

                        {memory.content_text && (
                            <motion.p
                                className="text-[var(--text-primary)] mb-4 line-clamp-4 flex-grow leading-relaxed"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                {memory.content_text}
                            </motion.p>
                        )}

                        {audioUrl && (
                            <motion.div
                                className="mb-4 rounded-xl overflow-hidden"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <audio src={audioUrl} controls className="w-full" />
                            </motion.div>
                        )}

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#D4C5B0]/50">
                            <motion.span
                                className="text-xs text-[var(--text-muted)] font-medium"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                {formatDate(memory.created_at)}
                            </motion.span>
                            {memory.mood && (
                                <MoodBadge mood={memory.mood} size="sm" />
                            )}
                        </div>
                    </div>
                </AnimatedCard>
            </Link>
        </motion.div>
    );
}
