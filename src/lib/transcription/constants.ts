export const DEFAULT_TRANSCRIPTION_LANGUAGE = "en";

export const VALID_TRANSCRIPTION_LANGUAGES = [
  "en",
  "es",
  "pt",
  "fr",
  "de",
  "it",
  "zh",
  "ja",
  "ko",
  "ar",
] as const;

export type TranscriptionLanguage = (typeof VALID_TRANSCRIPTION_LANGUAGES)[number];

export type TranscriptionStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export const GEMINI_TRANSCRIPTION_MODEL = "gemini-2.0-flash";
