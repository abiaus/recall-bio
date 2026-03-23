"use server";

import { formatSupabaseError } from "@/lib/supabase/formatError";
import { createClient } from "@/lib/supabase/server";

type QuestionToRate = {
  id: string;
  text: string;
  category: string;
};

export type NextQuestionToRateResult = {
  success: boolean;
  question: QuestionToRate | null;
  error?: string;
};

export type SubmitQuestionRatingInput = {
  difficultyToAnswer: number;
  clarity: number;
  correctCategory: boolean;
};

export type SubmitQuestionRatingResult = {
  success: boolean;
  error?: string;
};

export type QuestionRatingStatsResult = {
  success: boolean;
  ratedCount: number;
  totalQuestions: number;
  error?: string;
};

function isValidScaleValue(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= 5;
}

export async function getNextQuestionToRate(
  locale: string = "en"
): Promise<NextQuestionToRateResult> {
  const supabase = await createClient();
  const useSpanish = locale === "es";

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, question: null, error: "No autenticado" };
  }

  try {
    const { data: ratedRows, error: ratedRowsError } = await supabase
      .schema("public")
      .from("question_ratings")
      .select("question_id")
      .eq("user_id", user.id);

    if (ratedRowsError) {
      console.error(
        "Error fetching rated question ids:",
        formatSupabaseError(ratedRowsError)
      );
      return {
        success: false,
        question: null,
        error: "Error al obtener la siguiente pregunta.",
      };
    }

    const ratedQuestionIds = new Set((ratedRows ?? []).map((row) => row.question_id));

    const { data: questions, error } = await supabase
      .schema("public")
      .from("questions")
      .select("id, text, text_es, tags")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1000);

    if (error) {
      console.error(
        "Error fetching next question to rate:",
        formatSupabaseError(error)
      );
      return {
        success: false,
        question: null,
        error: "Error al obtener la siguiente pregunta.",
      };
    }

    const nextQuestion = (questions ?? []).find((q) => !ratedQuestionIds.has(q.id));

    if (!nextQuestion) {
      return { success: true, question: null };
    }

    const tags = Array.isArray(nextQuestion.tags) ? nextQuestion.tags : [];
    const firstCategory =
      typeof tags[0] === "string" && tags[0].trim().length > 0
        ? tags[0]
        : "general";
    const text =
      useSpanish &&
      typeof nextQuestion.text_es === "string" &&
      nextQuestion.text_es.trim().length > 0
        ? nextQuestion.text_es
        : nextQuestion.text;

    return {
      success: true,
      question: {
        id: nextQuestion.id,
        text,
        category: firstCategory,
      },
    };
  } catch (error) {
    console.error("Unexpected error fetching next question to rate:", error);
    return {
      success: false,
      question: null,
      error: "Ocurrió un error inesperado.",
    };
  }
}

export async function submitQuestionRating(
  questionId: string,
  input: SubmitQuestionRatingInput
): Promise<SubmitQuestionRatingResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado" };
  }

  if (!questionId || typeof questionId !== "string") {
    return { success: false, error: "Pregunta inválida." };
  }

  if (
    !isValidScaleValue(input.difficultyToAnswer) ||
    !isValidScaleValue(input.clarity) ||
    typeof input.correctCategory !== "boolean"
  ) {
    return { success: false, error: "Datos de calificación inválidos." };
  }

  try {
    const { error } = await supabase
      .schema("public")
      .from("question_ratings")
      .upsert(
        {
          user_id: user.id,
          question_id: questionId,
          difficulty_to_answer: input.difficultyToAnswer,
          clarity: input.clarity,
          correct_category: input.correctCategory,
          rated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,question_id",
        }
      );

    if (error) {
      console.error(
        "Error submitting question rating:",
        formatSupabaseError(error)
      );
      return {
        success: false,
        error: "Error al guardar la calificación. Por favor, intenta de nuevo.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error submitting question rating:", error);
    return {
      success: false,
      error: "Ocurrió un error inesperado. Por favor, intenta de nuevo.",
    };
  }
}

export async function getUserRatingStats(): Promise<QuestionRatingStatsResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, ratedCount: 0, totalQuestions: 0, error: "No autenticado" };
  }

  try {
    const ratedCountPromise = supabase
      .schema("public")
      .from("question_ratings")
      .select("id, questions!inner(id)", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("questions.is_active", true);

    const totalQuestionsPromise = supabase
      .schema("public")
      .from("questions")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true);

    const [ratedResult, totalResult] = await Promise.all([
      ratedCountPromise,
      totalQuestionsPromise,
    ]);

    if (ratedResult.error || totalResult.error) {
      console.error("Error fetching question rating stats:", {
        ratedError: formatSupabaseError(ratedResult.error),
        totalError: formatSupabaseError(totalResult.error),
      });
      return {
        success: false,
        ratedCount: 0,
        totalQuestions: 0,
        error: "Error al obtener el progreso de calificación.",
      };
    }

    return {
      success: true,
      ratedCount: ratedResult.count ?? 0,
      totalQuestions: totalResult.count ?? 0,
    };
  } catch (error) {
    console.error("Unexpected error fetching question rating stats:", error);
    return {
      success: false,
      ratedCount: 0,
      totalQuestions: 0,
      error: "Ocurrió un error inesperado.",
    };
  }
}
