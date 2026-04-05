import { SupabaseClient } from "@supabase/supabase-js";
import { getLocalDateString } from "@/utils/dateUtils";

interface CreateMemoryParams {
  userId: string;
  source: string; // "telegram", "whatsapp", etc.
  localDate: string; // The date resolving to the user's timezone YYYY-MM-DD
  textContent?: string;
  questionId?: string; // If this reply answers a prompt
}

interface CreateMemoryResult {
  success: boolean;
  memoryId?: string;
  error?: string;
}

/**
 * Creates a memory from a channel (like Telegram) using a server/admin client.
 * Returns the created memory ID.
 */
export async function createMemoryFromChannel(
  supabaseAdmin: SupabaseClient,
  params: CreateMemoryParams
): Promise<CreateMemoryResult> {
  const { userId, source, localDate, textContent, questionId } = params;

  // Insert the core memory
  const { data: memory, error: memoryError } = await supabaseAdmin
    .schema("public")
    .from("memories")
    .insert({
      user_id: userId,
      prompt_date: localDate,
      question_id: questionId || null,
      content_text: textContent || null,
      is_private: true,
      media_status: "ready", // Si viene solo texto, ya está ready
    })
    .select("id")
    .single();

  if (memoryError || !memory) {
    console.error("Error creating memory from channel:", memoryError);
    return { success: false, error: "Error en base de datos" };
  }

  return {
    success: true,
    memoryId: memory.id,
  };
}
