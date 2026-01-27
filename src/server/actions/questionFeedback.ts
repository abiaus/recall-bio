"use server";

import { createClient } from "@/lib/supabase/server";

export type QuestionFeedbackResult = {
  success: boolean;
  rating?: "up" | "down" | null;
  error?: string;
};

export async function submitQuestionFeedback(
  questionId: string,
  rating: "up" | "down" | null
): Promise<QuestionFeedbackResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado" };
  }

  try {
    // Si rating es null, eliminar el feedback existente
    if (rating === null) {
      const { error } = await supabase
        .schema("public")
        .from("question_feedback")
        .delete()
        .eq("user_id", user.id)
        .eq("question_id", questionId);

      if (error) {
        console.error("Error deleting question feedback:", error);
        return {
          success: false,
          error: "Error al eliminar feedback. Por favor, intenta de nuevo.",
        };
      }

      return { success: true, rating: null };
    }

    // Upsert del feedback (insertar o actualizar)
    const { error } = await supabase
      .schema("public")
      .from("question_feedback")
      .upsert(
        {
          user_id: user.id,
          question_id: questionId,
          rating: rating,
        },
        {
          onConflict: "user_id,question_id",
        }
      );

    if (error) {
      console.error("Error submitting question feedback:", error);
      return {
        success: false,
        error: "Error al guardar feedback. Por favor, intenta de nuevo.",
      };
    }

    return { success: true, rating };
  } catch (error) {
    console.error("Unexpected error submitting question feedback:", error);
    return {
      success: false,
      error: "Ocurrió un error inesperado. Por favor, intenta de nuevo.",
    };
  }
}

export async function getQuestionFeedback(
  questionId: string
): Promise<QuestionFeedbackResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado" };
  }

  try {
    const { data, error } = await supabase
      .schema("public")
      .from("question_feedback")
      .select("rating")
      .eq("user_id", user.id)
      .eq("question_id", questionId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching question feedback:", error);
      return { success: false, error: "Error al obtener feedback." };
    }

    return {
      success: true,
      rating: (data?.rating as "up" | "down" | null) || null,
    };
  } catch (error) {
    console.error("Unexpected error fetching question feedback:", error);
    return {
      success: false,
      error: "Ocurrió un error inesperado.",
    };
  }
}
