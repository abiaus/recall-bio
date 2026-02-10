import {
  DEFAULT_TRANSCRIPTION_LANGUAGE,
  GEMINI_TRANSCRIPTION_MODEL,
  VALID_TRANSCRIPTION_LANGUAGES,
} from "@/lib/transcription/constants";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models";

function buildPrompt(language: string): string {
  return [
    "You are a highly accurate speech transcription system.",
    "Transcribe the audio exactly as spoken, preserving:",
    "- pauses with ellipsis (...) when meaningful",
    "- disfluencies/fillers (uh, um, etc.)",
    "- emotional inflections using punctuation naturally",
    "- original language and wording",
    `Preferred language hint: ${language}.`,
    "Return only the transcript text without markdown or explanations.",
  ].join("\n");
}

export async function transcribeWithGemini(params: {
  audioBase64: string;
  mimeType: string;
  preferredLanguage?: string | null;
  apiKey?: string;
}): Promise<{ transcript: string; detectedLanguage: string }> {
  const apiKey = params.apiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY no configurada");
  }

  const preferredLanguage =
    params.preferredLanguage &&
    VALID_TRANSCRIPTION_LANGUAGES.includes(
      params.preferredLanguage as (typeof VALID_TRANSCRIPTION_LANGUAGES)[number]
    )
      ? params.preferredLanguage
      : DEFAULT_TRANSCRIPTION_LANGUAGE;

  const response = await fetch(
    `${GEMINI_API_URL}/${GEMINI_TRANSCRIPTION_MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: buildPrompt(preferredLanguage) },
              {
                inline_data: {
                  mime_type: params.mimeType,
                  data: params.audioBase64,
                },
              },
            ],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${errorText}`);
  }

  const payload = (await response.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };

  const transcript = payload.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!transcript) {
    throw new Error("Gemini no devolvió una transcripción válida");
  }

  return {
    transcript,
    detectedLanguage: preferredLanguage,
  };
}
