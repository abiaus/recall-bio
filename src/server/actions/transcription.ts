"use server";

import { createClient } from "@/lib/supabase/server";
import { checkFeature } from "@/lib/features/checkFeature";
import { getFeatureLimit } from "@/lib/features/getFeatureLimit";
import { getMonthlyFeatureUsage } from "@/lib/features/getMonthlyFeatureUsage";
import {
  DEFAULT_TRANSCRIPTION_LANGUAGE,
  VALID_TRANSCRIPTION_LANGUAGES,
} from "@/lib/transcription/constants";

function isValidMemoryId(memoryId: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    memoryId
  );
}

export async function queueMemoryTranscriptionAction(memoryId: string): Promise<{
  success: boolean;
  queued: boolean;
  error?: string;
}> {
  if (!isValidMemoryId(memoryId)) {
    return { success: false, queued: false, error: "ID de memoria inválido" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, queued: false, error: "No autenticado" };
  }

  try {
    const canTranscribe = await checkFeature(supabase, user.id, "transcription");
    if (!canTranscribe) {
      return {
        success: false,
        queued: false,
        error: "Tu plan no tiene transcripción habilitada",
      };
    }

    const monthlyLimit = await getFeatureLimit(supabase, user.id, "transcription");
    if (typeof monthlyLimit === "number") {
      const currentUsage = await getMonthlyFeatureUsage(
        supabase,
        user.id,
        "transcription"
      );
      if (currentUsage >= monthlyLimit) {
        return {
          success: false,
          queued: false,
          error: "Alcanzaste tu límite mensual de transcripciones",
        };
      }
    }

    const { data: profile } = await supabase
      .schema("public")
      .from("profiles")
      .select("transcription_language")
      .eq("id", user.id)
      .maybeSingle();

    const preferredLanguage = profile?.transcription_language;
    const transcriptionLanguage = VALID_TRANSCRIPTION_LANGUAGES.includes(
      preferredLanguage
    )
      ? preferredLanguage
      : DEFAULT_TRANSCRIPTION_LANGUAGE;

    const { data, error } = await supabase
      .schema("public")
      .from("memory_media")
      .update({
        transcript_status: "pending",
        transcript_language: transcriptionLanguage,
        transcript_error: null,
        transcript_updated_at: new Date().toISOString(),
      })
      .eq("memory_id", memoryId)
      .eq("user_id", user.id)
      .eq("kind", "audio")
      .select("memory_id")
      .maybeSingle();

    if (error) {
      console.error("Error queueing transcription:", error);
      return {
        success: false,
        queued: false,
        error: "No se pudo encolar la transcripción",
      };
    }

    return { success: true, queued: Boolean(data) };
  } catch (error) {
    console.error("Unexpected error queueing transcription:", error);
    return {
      success: false,
      queued: false,
      error: "Ocurrió un error inesperado al encolar la transcripción",
    };
  }
}

export async function retryMemoryTranscriptionAction(memoryId: string): Promise<{
  success: boolean;
  queued: boolean;
  error?: string;
}> {
  if (!isValidMemoryId(memoryId)) {
    return { success: false, queued: false, error: "ID de memoria inválido" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, queued: false, error: "No autenticado" };
  }

  try {
    const canTranscribe = await checkFeature(supabase, user.id, "transcription");
    if (!canTranscribe) {
      return {
        success: false,
        queued: false,
        error: "Tu plan no tiene transcripción habilitada",
      };
    }

    const { data, error } = await supabase
      .schema("public")
      .from("memory_media")
      .update({
        transcript_status: "pending",
        transcript_error: null,
        transcript_updated_at: new Date().toISOString(),
      })
      .eq("memory_id", memoryId)
      .eq("user_id", user.id)
      .eq("kind", "audio")
      .eq("transcript_status", "failed")
      .select("memory_id")
      .maybeSingle();

    if (error) {
      console.error("Error retrying transcription:", error);
      return {
        success: false,
        queued: false,
        error: "No se pudo reintentar la transcripción",
      };
    }

    return { success: true, queued: Boolean(data) };
  } catch (error) {
    console.error("Unexpected error retrying transcription:", error);
    return {
      success: false,
      queued: false,
      error: "Ocurrió un error inesperado al reintentar",
    };
  }
}
