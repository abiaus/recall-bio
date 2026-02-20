import { createClient } from "npm:@supabase/supabase-js@2";

const GEMINI_MODEL = "gemini-2.0-flash";
const MAX_RETRIES = 3;

const PREFIX = "[transcribe-audio]";

type LogLevel = "info" | "warn" | "error";

function log(
  level: LogLevel,
  msg: string,
  ctx?: Record<string, unknown>
) {
  const entry = {
    level,
    msg,
    ts: new Date().toISOString(),
    ...ctx,
  };
  const line = JSON.stringify(entry);
  if (level === "error") {
    console.error(`${PREFIX} ${line}`);
  } else if (level === "warn") {
    console.warn(`${PREFIX} ${line}`);
  } else {
    console.log(`${PREFIX} ${line}`);
  }
}

type PendingMedia = {
  id: string;
  user_id: string;
  storage_bucket: string;
  storage_path: string;
  mime_type: string | null;
  transcript_language: string | null;
  transcript_attempts: number | null;
};

const CHUNK_SIZE = 8192;

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    const chunk = bytes.subarray(i, Math.min(i + CHUNK_SIZE, bytes.length));
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  return btoa(binary);
}

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
  mediaId?: string;
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
    const body = await response.text();
    log("error", "Gemini API failed", {
      mediaId: params.mediaId,
      status: response.status,
      body: body.slice(0, 500),
    });
    throw new Error(`Gemini API failed with status ${response.status}`);
  }

  const payload = (await response.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    };
  };

  const transcript = payload.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!transcript) {
    log("error", "Gemini returned empty transcript", {
      mediaId: params.mediaId,
      hasCandidates: Boolean(payload.candidates?.length),
    });
    throw new Error("Gemini returned empty transcript");
  }

  return transcript;
}

async function withRetries<T>(
  action: () => Promise<T>,
  ctx?: { mediaId?: string }
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      return await action();
    } catch (error) {
      lastError = error;
      const errMsg = error instanceof Error ? error.message : String(error);
      log(
        attempt < MAX_RETRIES ? "warn" : "error",
        `Attempt ${attempt}/${MAX_RETRIES} failed`,
        {
          ...ctx,
          attempt,
          error: errMsg.slice(0, 200),
        }
      );
      if (attempt < MAX_RETRIES) {
        const delayMs = 1000 * attempt;
        log("info", "Retrying after delay", { ...ctx, delayMs });
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError;
}

Deno.serve(async (request) => {
  const startTime = Date.now();

  try {
    if (request.method !== "POST") {
      log("warn", "Method not allowed", { method: request.method });
      return new Response("Method not allowed", { status: 405 });
    }

    const payload = (await request.json().catch(() => ({}))) as { batchSize?: number };
    const batchSize = Math.min(Math.max(payload.batchSize || 5, 1), 20);

    log("info", "Request started", {
      batchSize,
    });

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!supabaseUrl || !serviceRoleKey || !geminiApiKey) {
      const missing = [
        !supabaseUrl && "SUPABASE_URL",
        !serviceRoleKey && "SUPABASE_SERVICE_ROLE_KEY",
        !geminiApiKey && "GEMINI_API_KEY",
      ].filter(Boolean);
      log("error", "Missing environment variables", { missing });
      return new Response("Missing required environment variables", { status: 500 });
    }

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
      log("error", "Failed to load pending rows", {
        error: pendingError.message,
        code: pendingError.code,
      });
      return new Response(JSON.stringify({ ok: false, error: pendingError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const rows = (pendingRows || []) as PendingMedia[];
    log("info", "Pending rows fetched", {
      count: rows.length,
      ids: rows.map((r) => r.id),
    });

    if (rows.length === 0) {
      log("info", "No pending items, returning early", {
        durationMs: Date.now() - startTime,
      });
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
        log("info", "Feature disabled for user, skipping", {
          mediaId: row.id,
          userId: row.user_id,
          plan,
        });
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
        log("error", "Failed to claim row for processing", {
          mediaId: row.id,
          error: claimError.message,
        });
        failed += 1;
        continue;
      }

      if (!claimedRow) {
        log("info", "Row claimed by another worker, skipping", {
          mediaId: row.id,
        });
        continue;
      }

      log("info", "Processing media", {
        mediaId: row.id,
        userId: row.user_id,
        attempt: nextAttempts,
        mimeType: row.mime_type,
        language: row.transcript_language,
      });

      try {
        const downloadStart = Date.now();
        const { data: fileBlob, error: downloadError } = await supabase.storage
          .from(row.storage_bucket)
          .download(row.storage_path);

        if (downloadError || !fileBlob) {
          throw new Error(downloadError?.message || "Could not download audio");
        }

        const arrayBuffer = await fileBlob.arrayBuffer();
        const sizeBytes = arrayBuffer.byteLength;
        const audioBase64 = arrayBufferToBase64(arrayBuffer);

        log("info", "Audio downloaded", {
          mediaId: row.id,
          sizeBytes,
          downloadMs: Date.now() - downloadStart,
        });

        const transcript = await withRetries(
          () =>
            callGemini({
              apiKey: geminiApiKey,
              audioBase64,
              mimeType: row.mime_type || "audio/webm",
              language: row.transcript_language || "en",
              mediaId: row.id,
            }),
          { mediaId: row.id }
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
        log("info", "Transcription completed", {
          mediaId: row.id,
          transcriptLength: transcript.length,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown transcription error";
        log("error", "Transcription failed", {
          mediaId: row.id,
          error: errorMessage.slice(0, 300),
        });
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

    const durationMs = Date.now() - startTime;
    log("info", "Batch finished", {
      processed,
      failed,
      total: rows.length,
      durationMs,
    });

    return new Response(JSON.stringify({ ok: true, processed, failed }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unhandled error";
    const stack = error instanceof Error ? error.stack : undefined;
    log("error", "Fatal error", {
      error: message,
      stack: stack?.slice(0, 500),
      durationMs: Date.now() - startTime,
    });
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
