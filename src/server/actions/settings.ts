"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  DEFAULT_TRANSCRIPTION_LANGUAGE,
  VALID_TRANSCRIPTION_LANGUAGES,
} from "@/lib/transcription/constants";

const VALID_LIFE_STAGES = [
  "teen",
  "young_adult",
  "adult",
  "midlife",
  "senior",
] as const;

type LifeStage = (typeof VALID_LIFE_STAGES)[number];
type TranscriptionLanguage = (typeof VALID_TRANSCRIPTION_LANGUAGES)[number];

export async function updateProfileAction(formData: FormData): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado" };
  }

  const displayName = (formData.get("displayName") as string)?.trim() || "";
  const lifeStage = (formData.get("lifeStage") as string)?.trim() || "";
  const timezone = (formData.get("timezone") as string)?.trim() || "";
  const transcriptionLanguage =
    (formData.get("transcriptionLanguage") as string)?.trim() ||
    DEFAULT_TRANSCRIPTION_LANGUAGE;

  // Validación
  if (displayName.length === 0 || displayName.length > 60) {
    return {
      success: false,
      error: "El nombre debe tener entre 1 y 60 caracteres",
    };
  }

  if (lifeStage && !VALID_LIFE_STAGES.includes(lifeStage as LifeStage)) {
    return {
      success: false,
      error: "Etapa de vida inválida",
    };
  }

  if (timezone.length === 0 || timezone.length > 100) {
    return {
      success: false,
      error: "La zona horaria debe tener entre 1 y 100 caracteres",
    };
  }

  if (
    !VALID_TRANSCRIPTION_LANGUAGES.includes(
      transcriptionLanguage as TranscriptionLanguage
    )
  ) {
    return {
      success: false,
      error: "Idioma de transcripción inválido",
    };
  }

  try {
    // Actualizar perfil en la tabla profiles
    const { error: profileError } = await supabase
      .schema("public")
      .from("profiles")
      .upsert({
        id: user.id,
        display_name: displayName,
        life_stage: lifeStage || null,
        timezone: timezone,
        transcription_language: transcriptionLanguage,
      })
      .select()
      .single();

    if (profileError) {
      console.error("Error updating profile:", profileError);
      return {
        success: false,
        error: "Error al actualizar el perfil. Por favor, intenta de nuevo.",
      };
    }

    // Sincronizar display_name con user_metadata para consistencia
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        display_name: displayName,
      },
    });

    if (authError) {
      console.error("Error updating auth metadata:", authError);
      // No fallamos aquí, solo logueamos el error ya que el perfil se actualizó correctamente
    }

    revalidatePath("/app/settings");
    return { success: true };
  } catch (error) {
    console.error("Unexpected error updating profile:", error);
    return {
      success: false,
      error: "Ocurrió un error inesperado. Por favor, intenta de nuevo.",
    };
  }
}

export async function updatePasswordAction(formData: FormData): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado" };
  }

  const newPassword = (formData.get("newPassword") as string) || "";
  const confirmPassword = (formData.get("confirmPassword") as string) || "";

  // Validación
  if (newPassword.length < 8) {
    return {
      success: false,
      error: "La contraseña debe tener al menos 8 caracteres",
    };
  }

  if (newPassword !== confirmPassword) {
    return {
      success: false,
      error: "Las contraseñas no coinciden",
    };
  }

  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error("Error updating password:", error);
      return {
        success: false,
        error: error.message || "Error al actualizar la contraseña",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error updating password:", error);
    return {
      success: false,
      error: "Ocurrió un error inesperado. Por favor, intenta de nuevo.",
    };
  }
}
