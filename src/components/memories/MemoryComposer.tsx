"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Mic, Square, Pause, Play, Trash2, CheckCircle2, Pen, Music2 } from "lucide-react";

interface MemoryComposerProps {
    questionId: string;
}

function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

const moodOptions = [
    { value: "happy", emoji: "😊", color: "from-amber-400 to-orange-400" },
    { value: "grateful", emoji: "🙏", color: "from-emerald-400 to-teal-400" },
    { value: "contemplative", emoji: "🤔", color: "from-indigo-400 to-purple-400" },
    { value: "nostalgic", emoji: "💭", color: "from-rose-400 to-pink-400" },
    { value: "peaceful", emoji: "😌", color: "from-sky-400 to-cyan-400" },
    { value: "excited", emoji: "🎉", color: "from-yellow-400 to-amber-400" },
];

export function MemoryComposer({ questionId }: MemoryComposerProps) {
    const t = useTranslations("today");
    const tRecording = useTranslations("recording");
    const [content, setContent] = useState("");
    const [mood, setMood] = useState("");
    const [loading, setLoading] = useState(false);
    const [savedMemoryId, setSavedMemoryId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"write" | "record">("write");
    const router = useRouter();
    const supabase = createClient();

    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [duration, setDuration] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
        };
    }, [audioUrl]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.max(180, textareaRef.current.scrollHeight)}px`;
        }
    }, [content]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: "audio/webm;codecs=opus",
            });

            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                setAudioBlob(blob);
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
            };

            mediaRecorder.start();
            setIsRecording(true);
            setDuration(0);

            intervalRef.current = setInterval(() => {
                setDuration((prev) => prev + 1);
            }, 1000);
        } catch (error) {
            console.error("Error accessing microphone:", error);
            alert(tRecording("microphoneError"));
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            setIsRecording(false);
            setIsPaused(false);
        }
    };

    const pauseRecording = () => {
        if (mediaRecorderRef.current && isRecording && !isPaused) {
            mediaRecorderRef.current.pause();
            setIsPaused(true);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
    };

    const resumeRecording = () => {
        if (mediaRecorderRef.current && isRecording && isPaused) {
            mediaRecorderRef.current.resume();
            setIsPaused(false);
            intervalRef.current = setInterval(() => {
                setDuration((prev) => prev + 1);
            }, 1000);
        }
    };

    const discardAudio = () => {
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
        }
        setAudioBlob(null);
        setAudioUrl(null);
        setDuration(0);
    };

    const uploadAudio = async (memoryId: string, userId: string) => {
        if (!audioBlob) return;

        const fileExt = "webm";
        const fileName = `${memoryId}_${Date.now()}.${fileExt}`;
        const filePath = `user/${userId}/memories/${memoryId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from("media")
            .upload(filePath, audioBlob, {
                contentType: "audio/webm",
                upsert: false,
            });

        if (uploadError) throw uploadError;

        const fileSize = audioBlob.size;

        const { error: dbError } = await supabase
            .schema("public")
            .from("memory_media")
            .insert({
                memory_id: memoryId,
                user_id: userId,
                kind: "audio",
                storage_bucket: "media",
                storage_path: filePath,
                mime_type: "audio/webm",
                bytes: fileSize,
                duration_ms: duration * 1000,
            });

        if (dbError) throw dbError;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                setLoading(false);
                return;
            }

            const today = new Date().toISOString().split("T")[0];

            const { data: memory, error } = await supabase
                .schema("public")
                .from("memories")
                .insert({
                    user_id: user.id,
                    question_id: questionId,
                    prompt_date: today,
                    content_text: content || null,
                    mood: mood || null,
                    is_private: true,
                })
                .select("id")
                .single();

            if (error) {
                console.error("Error saving memory:", error);
                setLoading(false);
                return;
            }

            if (audioBlob) {
                await uploadAudio(memory.id, user.id);
            }

            setSavedMemoryId(memory.id);
            setContent("");
            setMood("");
            discardAudio();
            router.refresh();
        } catch (err) {
            console.error("Error saving memory:", err);
        } finally {
            setLoading(false);
        }
    };

    const hasContent = content.trim().length > 0 || audioBlob !== null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tab Switcher */}
                <div className="flex gap-2 p-1.5 bg-[var(--bg-warm)]/60 rounded-2xl w-fit">
                    <button
                        type="button"
                        onClick={() => setActiveTab("write")}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${activeTab === "write"
                                ? "bg-white text-[var(--text-primary)] shadow-sm"
                                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                            }`}
                    >
                        <Pen className="w-4 h-4" />
                        {t("writeTab")}
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("record")}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${activeTab === "record"
                                ? "bg-white text-[var(--text-primary)] shadow-sm"
                                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                            }`}
                    >
                        <Music2 className="w-4 h-4" />
                        {t("recordTab")}
                    </button>
                </div>

                {/* Content Area */}
                <AnimatePresence mode="wait">
                    {activeTab === "write" ? (
                        <motion.div
                            key="write"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className="relative"
                        >
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-[var(--primary-terracotta)]/20 via-[var(--accent-dusty-rose)]/20 to-[var(--accent-lavender)]/20 rounded-3xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                                <textarea
                                    ref={textareaRef}
                                    id="content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="relative w-full px-6 py-5 rounded-2xl border-2 border-[var(--bg-warm)] bg-white/80 backdrop-blur-sm text-[var(--text-primary)] text-lg leading-relaxed focus:outline-none focus:border-[var(--primary-terracotta)]/30 resize-none transition-all duration-300 placeholder:text-[var(--text-muted)]/60"
                                    placeholder={t("answerPlaceholder")}
                                    style={{ minHeight: "180px" }}
                                />
                                <div className="absolute bottom-4 right-4 text-xs text-[var(--text-muted)]">
                                    {content.length} {t("characters")}
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="record"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--bg-warm)] to-white border-2 border-[var(--bg-warm)] p-8">
                                {/* Background decoration */}
                                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[var(--blob-peach)] to-transparent opacity-40 rounded-bl-full" />

                                <div className="relative flex flex-col items-center justify-center min-h-[180px]">
                                    {!isRecording && !audioBlob && (
                                        <motion.div
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="flex flex-col items-center gap-6"
                                        >
                                            <button
                                                type="button"
                                                onClick={startRecording}
                                                className="group relative w-24 h-24 rounded-full bg-gradient-to-br from-[var(--primary-terracotta)] to-[var(--primary-clay)] text-white shadow-lg shadow-[var(--primary-terracotta)]/30 hover:shadow-xl hover:shadow-[var(--primary-terracotta)]/40 transition-all duration-300 hover:scale-105"
                                            >
                                                <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <Mic className="w-10 h-10 mx-auto" />
                                            </button>
                                            <p className="text-[var(--text-muted)] text-sm">
                                                {tRecording("tapToRecord")}
                                            </p>
                                        </motion.div>
                                    )}

                                    {isRecording && (
                                        <motion.div
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="flex flex-col items-center gap-6"
                                        >
                                            {/* Animated recording indicator */}
                                            <div className="relative">
                                                <motion.div
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                                    className="absolute inset-0 rounded-full bg-red-500/20"
                                                />
                                                <motion.div
                                                    animate={{ scale: [1, 1.1, 1] }}
                                                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                                                    className="absolute inset-[-8px] rounded-full bg-red-500/10"
                                                />
                                                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                                                    <div className="w-4 h-4 bg-white rounded-sm" />
                                                </div>
                                            </div>

                                            <div className="text-center">
                                                <p className="text-3xl font-light text-[var(--text-primary)] tabular-nums">
                                                    {formatTime(duration)}
                                                </p>
                                                <p className="text-sm text-[var(--text-muted)] mt-1">
                                                    {isPaused ? tRecording("paused") : tRecording("recording")}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {!isPaused ? (
                                                    <button
                                                        type="button"
                                                        onClick={pauseRecording}
                                                        className="p-3 rounded-full bg-white border-2 border-[var(--bg-warm)] text-[var(--text-secondary)] hover:bg-[var(--bg-warm)] transition-colors"
                                                    >
                                                        <Pause className="w-5 h-5" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={resumeRecording}
                                                        className="p-3 rounded-full bg-white border-2 border-[var(--bg-warm)] text-[var(--text-secondary)] hover:bg-[var(--bg-warm)] transition-colors"
                                                    >
                                                        <Play className="w-5 h-5" />
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={stopRecording}
                                                    className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                                                >
                                                    <Square className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {audioBlob && !isRecording && (
                                        <motion.div
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="w-full space-y-4"
                                        >
                                            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[var(--bg-warm)]">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--accent-sage)] to-emerald-500 flex items-center justify-center text-white">
                                                    <Music2 className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-[var(--text-primary)]">
                                                        {tRecording("recordingReady")}
                                                    </p>
                                                    <p className="text-sm text-[var(--text-muted)]">
                                                        {formatTime(duration)}
                                                    </p>
                                                </div>
                                            </div>

                                            {audioUrl && (
                                                <audio src={audioUrl} controls className="w-full rounded-lg" />
                                            )}

                                            <button
                                                type="button"
                                                onClick={discardAudio}
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                {tRecording("discard")}
                                            </button>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Mood Selector */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                >
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
                        {t("mood")}
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {moodOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setMood(mood === option.value ? "" : option.value)}
                                className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-300 ${mood === option.value
                                        ? `border-transparent bg-gradient-to-r ${option.color} text-white shadow-md`
                                        : "border-[var(--bg-warm)] bg-white hover:border-[var(--primary-terracotta)]/30 text-[var(--text-secondary)]"
                                    }`}
                            >
                                <span className="text-lg">{option.emoji}</span>
                                <span className="text-sm font-medium">{t(`mood${option.value.charAt(0).toUpperCase() + option.value.slice(1)}`)}</span>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="pt-4"
                >
                    <button
                        type="submit"
                        disabled={loading || !hasContent}
                        className="group relative w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[var(--primary-terracotta)] to-[var(--primary-clay)] text-white font-semibold text-lg shadow-lg shadow-[var(--primary-terracotta)]/25 hover:shadow-xl hover:shadow-[var(--primary-terracotta)]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg transition-all duration-300 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        <span className="relative">
                            {loading ? t("savingMemory") : t("saveMemory")}
                        </span>
                    </button>
                </motion.div>

                {/* Success Message */}
                <AnimatePresence>
                    {savedMemoryId && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/50"
                        >
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-medium text-emerald-800">
                                    {t("memorySaved").split('.')[0]}
                                </p>
                                <p className="text-sm text-emerald-600/80">
                                    {t("memorySavedSubtext")}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>
        </motion.div>
    );
}
