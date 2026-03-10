"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { Mic, Square, Pause, Play, Trash2, CheckCircle2, Pen, Music2, ImagePlus, X } from "lucide-react";
import { queueMemoryTranscriptionAction } from "@/server/actions/transcription";

interface MemoryComposerProps {
    questionId: string;
}

function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const MAX_TOTAL_IMAGE_BYTES = 20 * 1024 * 1024; // 20MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const moodOptions = [
    { value: "happy", emoji: "😊", color: "from-amber-400 to-orange-400" },
    { value: "grateful", emoji: "🙏", color: "from-emerald-400 to-teal-400" },
    { value: "contemplative", emoji: "🤔", color: "from-indigo-400 to-purple-400" },
    { value: "nostalgic", emoji: "💭", color: "from-rose-400 to-pink-400" },
    { value: "peaceful", emoji: "😌", color: "from-sky-400 to-cyan-400" },
    { value: "excited", emoji: "🎉", color: "from-yellow-400 to-amber-400" },
    { value: "sad", emoji: "😢", color: "from-blue-500 to-indigo-600" },
    { value: "anxious", emoji: "😰", color: "from-yellow-500 to-orange-500" },
    { value: "stressed", emoji: "😓", color: "from-red-500 to-orange-600" },
    { value: "angry", emoji: "😠", color: "from-red-600 to-red-800" },
    { value: "lonely", emoji: "😔", color: "from-gray-500 to-gray-700" },
    { value: "tired", emoji: "😴", color: "from-slate-500 to-slate-700" },
];

export function MemoryComposer({ questionId }: MemoryComposerProps) {
    const t = useTranslations("today");
    const tRecording = useTranslations("recording");
    const tCommon = useTranslations("common");
    const locale = useLocale();
    const [content, setContent] = useState("");
    const [mood, setMood] = useState("");
    const [loading, setLoading] = useState(false);
    const [savedMemoryId, setSavedMemoryId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"write" | "record">("write");
    const router = useRouter();
    const supabase = useMemo(() => createClient(), []);

    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [duration, setDuration] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [imageErrors, setImageErrors] = useState<string[]>([]);
    const [imageUploadError, setImageUploadError] = useState<string | null>(null);

    const [audioLimit, setAudioLimit] = useState<number | null>(null);
    const [maxImagesLimit, setMaxImagesLimit] = useState<number>(MAX_IMAGES);

    useEffect(() => {
        const fetchPlanLimits = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase.from("profiles").select("plan").eq("id", user.id).maybeSingle();
                if (data?.plan === "free") {
                    setAudioLimit(60); // 1 minute free limit
                    setMaxImagesLimit(1); // 1 photo max free limit
                }
            }
        };
        fetchPlanLimits();
    }, [supabase]);

    useEffect(() => {
        if (audioLimit && duration >= audioLimit && isRecording) {
            stopRecording();
            alert("Maximum 1-minute audio recording reached for the Free plan. Upgrade to Premium for unlimited recordings.");
        }
    }, [duration, audioLimit, isRecording]);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const imagePreviewsRef = useRef<string[]>([]);
    imagePreviewsRef.current = imagePreviews;

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
            imagePreviewsRef.current.forEach((url) => URL.revokeObjectURL(url));
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

    const validateAndAddImages = (files: FileList | null) => {
        if (!files?.length) return;
        const newFiles: File[] = [];
        const newPreviews: string[] = [];
        const newErrors: string[] = [];
        const currentTotal = imageFiles.reduce((sum, f) => sum + f.size, 0);
        let addedBytes = 0;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (imageFiles.length + newFiles.length >= maxImagesLimit) {
                newErrors.push(`${t("imageCountExceeded")} (Limit: ${maxImagesLimit})`);
                break;
            }
            if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
                newErrors.push(`${file.name}: ${t("imageTypeInvalid")}`);
                continue;
            }
            if (file.size > MAX_IMAGE_SIZE_BYTES) {
                newErrors.push(`${file.name}: ${t("imageTooLarge")}`);
                continue;
            }
            if (currentTotal + addedBytes + file.size > MAX_TOTAL_IMAGE_BYTES) {
                newErrors.push(t("imagesTotalExceeded"));
                break;
            }
            newFiles.push(file);
            newPreviews.push(URL.createObjectURL(file));
            addedBytes += file.size;
        }
        setImageErrors((prev) => [...prev, ...newErrors].slice(-5));
        setImageFiles((prev) => [...prev, ...newFiles].slice(0, maxImagesLimit));
        setImagePreviews((prev) => [...prev, ...newPreviews].slice(0, maxImagesLimit));
    };

    const removeImage = (index: number) => {
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => {
            const url = prev[index];
            if (url) URL.revokeObjectURL(url);
            return prev.filter((_, i) => i !== index);
        });
        setImageErrors([]);
    };

    const clearImageErrors = () => setImageErrors([]);

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

    const uploadImages = async (memoryId: string, userId: string) => {
        if (!imageFiles.length) return;
        for (const file of imageFiles) {
            const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
            const safeExt = ["jpeg", "jpg", "png", "webp"].includes(ext) ? ext : "jpg";
            const fileName = `${memoryId}_${Date.now()}_${Math.random().toString(36).slice(2)}.${safeExt}`;
            const filePath = `user/${userId}/memories/${memoryId}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("media")
                .upload(filePath, file, {
                    contentType: file.type,
                    upsert: false,
                });
            if (uploadError) throw uploadError;

            const { error: dbError } = await supabase
                .schema("public")
                .from("memory_media")
                .insert({
                    memory_id: memoryId,
                    user_id: userId,
                    kind: "image",
                    storage_bucket: "media",
                    storage_path: filePath,
                    mime_type: file.type,
                    bytes: file.size,
                });
            if (dbError) throw dbError;
        }
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

            const uploadPromises: Promise<void>[] = [];
            if (audioBlob) {
                uploadPromises.push(uploadAudio(memory.id, user.id));
                uploadPromises.push(
                    queueMemoryTranscriptionAction(memory.id).then((r) => {
                        if (!r.success) console.error("Error queueing transcription:", r.error);
                    })
                );
            }
            if (imageFiles.length) {
                uploadPromises.push(
                    uploadImages(memory.id, user.id).catch((imgErr) => {
                        console.error("Error uploading images:", imgErr);
                        setImageUploadError(t("imageUploadPartialError"));
                    })
                );
            }
            await Promise.all(uploadPromises);

            setSavedMemoryId(memory.id);
            setContent("");
            setMood("");
            discardAudio();
            setImageFiles([]);
            imagePreviews.forEach((url) => URL.revokeObjectURL(url));
            setImagePreviews([]);
            setImageErrors([]);
            setImageUploadError(null);

            // Delay redirect to allow user to see the success message
            setTimeout(() => {
                router.refresh();
                router.push(`/app/memories`);
            }, 2000);
        } catch (err) {
            console.error("Error saving memory:", err);
            setLoading(false);
        }
    };

    const hasContent = content.trim().length > 0 || audioBlob !== null || imageFiles.length > 0;

    return (
        <AnimatePresence mode="wait">
            {!savedMemoryId ? (
                <motion.div
                    key="composer-form"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
                    transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Tab Switcher */}
                        <div className="flex gap-2 p-1.5 bg-[var(--bg-warm)]/60 rounded-2xl w-fit">
                            <button
                                type="button"
                                onClick={() => setActiveTab("write")}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-terracotta)] focus-visible:ring-offset-2 ${activeTab === "write"
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
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-terracotta)] focus-visible:ring-offset-2 ${activeTab === "record"
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
                                        <textarea
                                            ref={textareaRef}
                                            id="content"
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            className="relative w-full px-6 py-5 rounded-sm border border-[#D4C5B0]/50 bg-white text-[var(--text-primary)] text-lg leading-relaxed focus:outline-none focus:border-[var(--primary-terracotta)] ring-0 focus:ring-1 focus:ring-[var(--primary-terracotta)] resize-none transition-colors duration-200 placeholder:text-[var(--text-muted)]/60 shadow-inner"
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
                                    <div className="relative overflow-hidden rounded-2xl bg-[var(--bg-warm)]/30 border border-[#D4C5B0]/30 p-8">
                                        {/* Clean solid background format */}

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
                                                        className="group relative w-24 h-24 min-w-[44px] min-h-[44px] rounded-full bg-[var(--primary-terracotta)] text-white shadow-sm hover:shadow-md hover:bg-[var(--primary-clay)] transition-all duration-200 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-terracotta)] focus-visible:ring-offset-2 cursor-pointer flex items-center justify-center"
                                                    >
                                                        <Mic className="w-10 h-10" />
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
                                                                className="p-3 min-w-[44px] min-h-[44px] rounded-full bg-white border-2 border-[var(--bg-warm)] text-[var(--text-secondary)] hover:bg-[var(--bg-warm)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-terracotta)] focus-visible:ring-offset-2 cursor-pointer"
                                                            >
                                                                <Pause className="w-5 h-5" />
                                                            </button>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                onClick={resumeRecording}
                                                                className="p-3 min-w-[44px] min-h-[44px] rounded-full bg-white border-2 border-[var(--bg-warm)] text-[var(--text-secondary)] hover:bg-[var(--bg-warm)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-terracotta)] focus-visible:ring-offset-2 cursor-pointer"
                                                            >
                                                                <Play className="w-5 h-5" />
                                                            </button>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={stopRecording}
                                                            className="p-3 min-w-[44px] min-h-[44px] rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 cursor-pointer"
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
                                                        className="flex items-center gap-2 px-4 py-2 min-h-[44px] text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 cursor-pointer"
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

                        {/* Image Upload */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.65 }}
                            className="space-y-2"
                        >
                            <label className="block text-sm font-medium text-[var(--text-secondary)]">
                                {t("imagesAddLabel")}
                            </label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                multiple
                                className="sr-only"
                                aria-label={t("imagesAdd")}
                                onChange={(e) => {
                                    validateAndAddImages(e.target.files);
                                    e.target.value = "";
                                }}
                            />
                            <div className="flex flex-wrap gap-3">
                                {imagePreviews.map((url, i) => (
                                    <motion.div
                                        key={url}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="relative group"
                                    >
                                        <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-[var(--bg-warm)] bg-[var(--bg-warm)]/50">
                                            <img
                                                src={url}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeImage(i)}
                                            className="absolute -top-1.5 -right-1.5 w-11 h-11 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-terracotta)] focus-visible:ring-offset-2 cursor-pointer"
                                            aria-label={t("imagesRemove")}
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                ))}
                                {imageFiles.length < maxImagesLimit && (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-20 h-20 min-w-[44px] min-h-[44px] rounded-xl border-2 border-dashed border-[var(--bg-warm)] bg-white/50 hover:bg-[var(--bg-warm)]/30 hover:border-[var(--primary-terracotta)]/30 flex items-center justify-center transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-terracotta)] focus-visible:ring-offset-2"
                                        aria-label={t("imagesAdd")}
                                    >
                                        <ImagePlus className="w-8 h-8 text-[var(--text-muted)]" />
                                    </button>
                                )}
                            </div>
                            {imageErrors.length > 0 && (
                                <div
                                    role="alert"
                                    className="flex flex-wrap gap-2 text-sm text-red-600"
                                >
                                    {imageErrors.map((err, i) => (
                                        <span key={i}>{err}</span>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={clearImageErrors}
                                        className="text-red-500 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 rounded cursor-pointer"
                                    >
                                        {tCommon("close")}
                                    </button>
                                </div>
                            )}
                        </motion.div>

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
                                        className={`flex items-center gap-2 px-4 py-3 min-h-[44px] rounded-xl border-2 transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-terracotta)] focus-visible:ring-offset-2 ${mood === option.value
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
                            className="pt-4 space-y-4"
                        >
                            {(content.trim().length > 0 && audioBlob !== null) && (
                                <div className="text-sm text-[var(--primary-terracotta)] bg-[var(--primary-terracotta)]/10 px-4 py-3 rounded-xl flex items-center justify-center text-center">
                                    {t("bothMediaNotice")}
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={loading || !hasContent}
                                className="group relative w-full sm:w-auto px-8 py-4 min-h-[44px] rounded-sm bg-[var(--primary-terracotta)] hover:bg-[var(--primary-clay)] text-white font-medium text-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-terracotta)] focus-visible:ring-offset-2 cursor-pointer"
                            >
                                <span className="relative">
                                    {loading ? t("savingMemory") : t("saveMemory")}
                                </span>
                            </button>
                        </motion.div>
                    </form>
                </motion.div>
            ) : (
                <motion.div
                    key="success-message"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col items-center justify-center min-h-[40vh] space-y-6 text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 15,
                            delay: 0.2
                        }}
                        className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl ${imageUploadError ? "bg-amber-500 shadow-amber-200" : "bg-[var(--primary-terracotta)] shadow-[var(--primary-terracotta)]/20"}`}
                    >
                        <CheckCircle2 className="w-10 h-10" />
                    </motion.div>

                    <div className="space-y-2">
                        <motion.h3
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className={`text-2xl font-serif ${imageUploadError ? "text-amber-800" : "text-[var(--text-primary)]"}`}
                        >
                            {t("memorySaved").split(".")[0]}
                        </motion.h3>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className={`text-base ${imageUploadError ? "text-amber-600/80" : "text-[var(--text-secondary)]"}`}
                        >
                            {imageUploadError ?? t("memorySavedSubtext")}
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
