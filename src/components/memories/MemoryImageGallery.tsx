"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";
import { Images } from "lucide-react";

interface MemoryImageGalleryProps {
    memoryId: string;
}

export function MemoryImageGallery({ memoryId }: MemoryImageGalleryProps) {
    const t = useTranslations("memories");
    const [slides, setSlides] = useState<{ src: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const supabase = useMemo(() => createClient(), []);

    useEffect(() => {
        let cancelled = false;
        const id = setTimeout(() => setLoading(true), 0);
        const run = async () => {
            const { data: mediaList } = await supabase
                .schema("public")
                .from("memory_media")
                .select("storage_path, storage_bucket")
                .eq("memory_id", memoryId)
                .eq("kind", "image")
                .order("created_at", { ascending: true });

            if (cancelled) return;
            if (mediaList?.length) {
                const urlPromises = mediaList.map((m) =>
                    supabase.storage
                        .from(m.storage_bucket)
                        .createSignedUrl(m.storage_path, 3600)
                        .then(({ data }) => (data?.signedUrl ? { src: data.signedUrl } : null))
                );
                const results = await Promise.all(urlPromises);
                if (!cancelled) {
                    const urls = results.filter((r): r is { src: string } => r !== null);
                    setSlides(urls);
                }
            }
            if (!cancelled) setLoading(false);
        };
        void run();
        return () => {
            cancelled = true;
            clearTimeout(id);
        };
    }, [memoryId, supabase]);

    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="rounded-2xl bg-gradient-to-br from-[var(--bg-warm)] to-white border border-[var(--bg-warm)] p-6 md:p-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--accent-dusty-rose)] to-[var(--accent-lavender)] flex items-center justify-center text-white shadow-lg">
                            <Images className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-medium text-[var(--text-primary)]">{t("imageGallery")}</h3>
                            <p className="text-sm text-[var(--text-muted)]">{t("imageGalleryTitle")}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="aspect-square rounded-xl bg-[var(--bg-warm)] animate-pulse" />
                        ))}
                    </div>
                </div>
            </motion.div>
        );
    }

    if (slides.length === 0) return null;

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="rounded-2xl bg-gradient-to-br from-[var(--bg-warm)] to-white border border-[var(--bg-warm)] p-6 md:p-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--accent-dusty-rose)] to-[var(--accent-lavender)] flex items-center justify-center text-white shadow-lg shadow-[var(--accent-dusty-rose)]/30">
                            <Images className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-medium text-[var(--text-primary)]">{t("imageGallery")}</h3>
                            <p className="text-sm text-[var(--text-muted)]">{t("imageGalleryTitle")}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {slides.map((slide, i) => (
                            <motion.button
                                key={slide.src}
                                type="button"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.05 * i, duration: 0.3 }}
                                onClick={() => {
                                    setLightboxIndex(i);
                                    setLightboxOpen(true);
                                }}
                                className="relative aspect-square rounded-xl overflow-hidden border-2 border-[var(--bg-warm)] bg-[var(--bg-warm)]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-terracotta)] focus-visible:ring-offset-2 group cursor-pointer"
                                aria-label={t("imageOf", { current: i + 1, total: slides.length })}
                            >
                                <img
                                    src={slide.src}
                                    alt={t("imageOf", { current: i + 1, total: slides.length })}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-xl" />
                            </motion.button>
                        ))}
                    </div>
                </div>
            </motion.div>

            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                index={lightboxIndex}
                slides={slides}
                on={{
                    view: ({ index }) => setLightboxIndex(index),
                }}
            />
        </>
    );
}
