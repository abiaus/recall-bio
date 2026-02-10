import { createClient } from "npm:@supabase/supabase-js@2";

const GEMINI_MODEL = "gemini-2.0-flash";
const MAX_RETRIES = 3;

type PendingMedia = {
  id: string;
  user_id: string;
  storage_bucket: string;
  storage_path: string;
  mime_type: string | null;
  transcript_language: string | null;
  transcript_attempts: number | null;
};

function buildPrompt(language: string) {
  return [
    "You are a highly accurate speech transcription system.",
    "Transcribe the audio exactly as spoken, preserving pauses, fillers, and natural inflection.",
    `Preferred language hint: ${language}.`,
    "Return only transcript text, no markdown, no explanations.",
  ].join("\n");
}

async function callGemini(params: {
  apiKey: string;
  audioBase64: string;
  mimeType: string;
  language: string;
}): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${params.apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: buildPrompt(params.language) },
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
    throw new Error(`Gemini API failed with status ${response.status}`);
  }

  const payload = (await response.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };

  const transcript = payload.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!transcript) {
    throw new Error("Gemini returned empty transcript");
  }

  return transcript;
}

async function withRetries<T>(action: () => Promise<T>): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      return await action();
    } catch (error) {
      lastError = error;
      if (attempt < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  throw lastError;
}

Deno.serve(async (request) => {
  try {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!supabaseUrl || !serviceRoleKey || !geminiApiKey) {
      return new Response("Missing required environment variables", { status: 500 });
    }

    const payload = (await request.json().catch(() => ({}))) as { batchSize?: number };
    const batchSize = Math.min(Math.max(payload.batchSize || 5, 1), 20);

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: pendingRows, error: pendingError } = await supabase
      .schema("public")
      .from("memory_media")
      .select(
        "id, user_id, storage_bucket, storage_path, mime_type, transcript_language, transcript_attempts"
      )
      .eq("kind", "audio")
      .eq("transcript_status", "pending")
      .order("created_at", { ascending: true })
      .limit(batchSize);

    if (pendingError) {
      console.error("Error loading pending rows", pendingError);
      return new Response(JSON.stringify({ ok: false, error: pendingError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const rows = (pendingRows || []) as PendingMedia[];
    if (rows.length === 0) {
      return new Response(JSON.stringify({ ok: true, processed: 0 }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    let processed = 0;
    let failed = 0;

    for (const row of rows) {
      const attempts = row.transcript_attempts || 0;
      const nextAttempts = attempts + 1;

      const { data: profile } = await supabase
        .schema("public")
        .from("profiles")
        .select("plan")
        .eq("id", row.user_id)
        .maybeSingle();

      const plan = profile?.plan || "free";
      const { data: planFeature } = await supabase
        .schema("public")
        .from("plan_features")
        .select("enabled")
        .eq("plan", plan)
        .eq("feature_key", "transcription")
        .maybeSingle();

      const { data: override } = await supabase
        .schema("public")
        .from("user_feature_overrides")
        .select("enabled")
        .eq("user_id", row.user_id)
        .eq("feature_key", "transcription")
        .maybeSingle();

      const featureEnabled =
        typeof override?.enabled === "boolean"
          ? override.enabled
          : Boolean(planFeature?.enabled);

      if (!featureEnabled) {
        await supabase
          .schema("public")
          .from("memory_media")
          .update({
            transcript_status: "failed",
            transcript_error: "Feature disabled for this user",
            transcript_attempts: nextAttempts,
            transcript_updated_at: new Date().toISOString(),
          })
          .eq("id", row.id);
        failed += 1;
        continue;
      }

      const { data: claimedRow, error: claimError } = await supabase
        .schema("public")
        .from("memory_media")
        .update({
          transcript_status: "processing",
          transcript_attempts: nextAttempts,
          transcript_updated_at: new Date().toISOString(),
        })
        .eq("id", row.id)
        .eq("transcript_status", "pending")
        .select("id")
        .maybeSingle();

      if (claimError) {
        console.error("Error claiming row for transcription", claimError);
        failed += 1;
        continue;
      }

      if (!claimedRow) {
        // Another worker likely claimed the row first.
        continue;
      }

      try {
        const { data: fileBlob, error: downloadError } = await supabase.storage
          .from(row.storage_bucket)
          .download(row.storage_path);

        if (downloadError || !fileBlob) {
          throw new Error(downloadError?.message || "Could not download audio");
        }

        const arrayBuffer = await fileBlob.arrayBuffer();
        const audioBase64 = btoa(
          String.fromCharCode(...new Uint8Array(arrayBuffer))
        );

        const transcript = await withRetries(() =>
          callGemini({
            apiKey: geminiApiKey,
            audioBase64,
            mimeType: row.mime_type || "audio/webm",
            language: row.transcript_language || "en",
          })
        );

        const { error: completeError } = await supabase
          .schema("public")
          .from("memory_media")
          .update({
            transcript,
            transcript_status: "completed",
            transcript_error: null,
            transcript_updated_at: new Date().toISOString(),
          })
          .eq("id", row.id);

        if (completeError) {
          throw new Error(completeError.message);
        }

        processed += 1;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown transcription error";
        await supabase
          .schema("public")
          .from("memory_media")
          .update({
            transcript_status: "failed",
            transcript_error: errorMessage.slice(0, 400),
            transcript_updated_at: new Date().toISOString(),
          })
          .eq("id", row.id);
        failed += 1;
      }
    }

    return new Response(JSON.stringify({ ok: true, processed, failed }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unhandled error";
    console.error("transcribe-audio fatal error", message);
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
