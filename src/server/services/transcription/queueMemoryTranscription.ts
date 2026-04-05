import { SupabaseClient } from "@supabase/supabase-js";
import { checkFeature } from "@/lib/features/checkFeature";
import { getFeatureLimit } from "@/lib/features/getFeatureLimit";
import { getMonthlyFeatureUsage } from "@/lib/features/getMonthlyFeatureUsage";
import {
  DEFAULT_TRANSCRIPTION_LANGUAGE,
  VALID_TRANSCRIPTION_LANGUAGES,
} from "@/lib/transcription/constants";

export function isValidMemoryId(memoryId: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    memoryId
  );
}

export type QueueTranscriptionResult = {
  success: boolean;
  queued: boolean;
  error?: string;
};

/**
 * Enqueues a memory's audio for transcription using any authenticated or admin supabase client.
 * Does not depend on the current session user internally.
 */
export async function queueMemoryTranscription(
  supabase: SupabaseClient,
  userId: string,
  memoryId: string
): Promise<QueueTranscriptionResult> {
  if (!isValidMemoryId(memoryId)) {
    return { success: false, queued: false, error: "ID de memoria inválido" };
  }

  try {
    const canTranscribe = await checkFeature(supabase, userId, "transcription");
    if (!canTranscribe) {
      return {
        success: false,
        queued: false,
        error: "Tu plan no tiene transcripción habilitada",
      };
    }

    const monthlyLimit = await getFeatureLimit(supabase, userId, "transcription");
    if (typeof monthlyLimit === "number") {
      const currentUsage = await getMonthlyFeatureUsage(
        supabase,
        userId,
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
      .eq("id", userId)
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
      .eq("user_id", userId)
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
