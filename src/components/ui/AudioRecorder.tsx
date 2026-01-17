"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mic, Pause, Play, Square, Trash2 } from "lucide-react";
import { AudioVisualizer } from "./AudioVisualizer";
import { GlowButton } from "./GlowButton";

interface AudioRecorderProps {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioBlob: Blob | null;
  audioUrl: string | null;
  onStart: () => void;
  onStop: () => void;
  onPause: () => void;
  onResume: () => void;
  onDiscard: () => void;
  t: {
    recordAudio: string;
    pause: string;
    resume: string;
    stop: string;
    discard: string;
  };
}

export function AudioRecorder({
  isRecording,
  isPaused,
  duration,
  audioBlob,
  audioUrl,
  onStart,
  onStop,
  onPause,
  onResume,
  onDiscard,
  t,
}: AudioRecorderProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {!isRecording && !audioBlob && (
          <motion.div
            key="start"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.button
              type="button"
              onClick={onStart}
              className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[var(--primary-terracotta)] to-[var(--accent-dusty-rose)] text-white shadow-xl flex items-center justify-center group"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-[var(--primary-terracotta)] opacity-30"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <Mic className="w-10 h-10 relative z-10" />
            </motion.button>
            <p className="text-sm font-medium text-[var(--text-secondary)]">
              {t.recordAudio}
            </p>
          </motion.div>
        )}

        {isRecording && (
          <motion.div
            key="recording"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex flex-col items-center gap-4">
              <motion.div
                className="relative w-20 h-20 rounded-full bg-red-500 flex items-center justify-center"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full bg-red-500"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
                <Square className="w-6 h-6 text-white relative z-10" />
              </motion.div>

              <div className="text-center space-y-2">
                <motion.p
                  className="text-2xl font-bold text-[var(--text-primary)]"
                  key={duration}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                >
                  {formatTime(duration)}
                </motion.p>
                <AudioVisualizer isRecording={true} audioBlob={null} audioUrl={null} />
              </div>

              <div className="flex gap-3">
                {!isPaused ? (
                  <GlowButton
                    variant="ghost"
                    onClick={onPause}
                    className="flex items-center gap-2"
                  >
                    <Pause className="w-4 h-4" />
                    {t.pause}
                  </GlowButton>
                ) : (
                  <GlowButton
                    variant="secondary"
                    onClick={onResume}
                    className="flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    {t.resume}
                  </GlowButton>
                )}
                <GlowButton
                  variant="primary"
                  onClick={onStop}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600"
                >
                  <Square className="w-4 h-4" />
                  {t.stop}
                </GlowButton>
              </div>
            </div>
          </motion.div>
        )}

        {audioBlob && !isRecording && (
          <motion.div
            key="audio"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="space-y-4"
          >
            {audioUrl && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl bg-white/80 p-4"
              >
                <audio src={audioUrl} controls className="w-full" />
              </motion.div>
            )}
            <GlowButton
              variant="ghost"
              onClick={onDiscard}
              className="flex items-center gap-2 w-full justify-center"
            >
              <Trash2 className="w-4 h-4" />
              {t.discard}
            </GlowButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
