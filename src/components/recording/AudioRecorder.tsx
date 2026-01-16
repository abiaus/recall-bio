"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";

interface AudioRecorderProps {
  memoryId: string;
  onUploadComplete?: () => void;
}

export function AudioRecorder({ memoryId, onUploadComplete }: AudioRecorderProps) {
  const t = useTranslations("recording");
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const supabase = createClient();

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
      alert(t("microphoneError"));
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

  const uploadAudio = async () => {
    if (!audioBlob) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Usuario no autenticado");
      }

      const fileExt = "webm";
      const fileName = `${memoryId}_${Date.now()}.${fileExt}`;
      const filePath = `user/${user.id}/memories/${memoryId}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, audioBlob, {
          contentType: "audio/webm",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get file size
      const fileSize = audioBlob.size;

      // Save metadata to database
      const { error: dbError } = await supabase
        .schema("recallbio")
        .from("memory_media")
        .insert({
          memory_id: memoryId,
          user_id: user.id,
          kind: "audio",
          storage_bucket: "media",
          storage_path: filePath,
          mime_type: "audio/webm",
          bytes: fileSize,
          duration_ms: duration * 1000,
        });

      if (dbError) throw dbError;

      setUploadProgress(100);
      onUploadComplete?.();
    } catch (error) {
      console.error("Error uploading audio:", error);
      alert("Error uploading audio. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {!isRecording && !audioBlob && (
          <button
            type="button"
            onClick={startRecording}
            className="px-6 py-3 rounded-lg bg-[#8B7355] text-white font-medium hover:bg-[#7A6345] transition-colors flex items-center gap-2"
          >
            <span>🎤</span>
            <span>{t("recordAudio")}</span>
          </button>
        )}

        {isRecording && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-[#2B241B] font-medium">
                {formatTime(duration)}
              </span>
            </div>
            {!isPaused ? (
              <button
                type="button"
                onClick={pauseRecording}
                className="px-4 py-2 rounded-lg border border-[#D4C5B0] text-[#2B241B] hover:bg-[#F6F1E7] transition-colors"
              >
                {t("pause")}
              </button>
            ) : (
              <button
                type="button"
                onClick={resumeRecording}
                className="px-4 py-2 rounded-lg border border-[#D4C5B0] text-[#2B241B] hover:bg-[#F6F1E7] transition-colors"
              >
                {t("resume")}
              </button>
            )}
            <button
              type="button"
              onClick={stopRecording}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              {t("stop")}
            </button>
          </div>
        )}

        {audioBlob && !isRecording && (
          <div className="space-y-2">
            {audioUrl && (
              <audio src={audioUrl} controls className="w-full" />
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={uploadAudio}
                disabled={uploading}
                className="px-4 py-2 rounded-lg bg-[#8B7355] text-white font-medium hover:bg-[#7A6345] transition-colors disabled:opacity-50"
              >
                {uploading ? `${t("uploading")} ${uploadProgress}%` : t("uploadAudio")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAudioBlob(null);
                  setAudioUrl(null);
                  setDuration(0);
                }}
                className="px-4 py-2 rounded-lg border border-[#D4C5B0] text-[#2B241B] hover:bg-[#F6F1E7] transition-colors"
              >
                {t("discard")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
