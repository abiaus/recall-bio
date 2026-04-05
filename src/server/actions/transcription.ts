"use server";

import { createClient } from "@/lib/supabase/server";
import { checkFeature } from "@/lib/features/checkFeature";
import { queueMemoryTranscription, isValidMemoryId } from "@/server/services/transcription/queueMemoryTranscription";

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

  return queueMemoryTranscription(supabase, user.id, memoryId);
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
