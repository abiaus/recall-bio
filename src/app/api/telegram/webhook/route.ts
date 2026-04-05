import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { DailyPromptService } from "@/server/services/prompts/dailyPromptService";
import { getLocalDateString } from "@/utils/dateUtils";
import { queueMemoryTranscription } from "@/server/services/transcription/queueMemoryTranscription";

// Security check: Make sure this request actually came from Telegram
// Easiest way in Next is via a secret path or checking a header token if configured
const TELEGRAM_WEBHOOK_SECRET_TOKEN = process.env.TELEGRAM_WEBHOOK_SECRET_TOKEN;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Inbound payload types (subset of Telegram API structs)
type TelegramUpdate = {
  update_id: number;
  message?: {
    message_id: number;
    from?: {
      id: number;
      is_bot: boolean;
      first_name: string;
      username?: string;
      language_code?: string;
    };
    chat?: {
      id: number;
      type: string;
      username?: string;
    };
    date: number;
    text?: string;
    voice?: {
      file_id: string;
      duration: number;
      mime_type: string; // usually 'audio/ogg'
    };
  };
};

export async function POST(req: NextRequest) {
  // 1. Verify webhook secret
  if (TELEGRAM_WEBHOOK_SECRET_TOKEN) {
    const headerSecret = req.headers.get("X-Telegram-Bot-Api-Secret-Token");
    if (headerSecret !== TELEGRAM_WEBHOOK_SECRET_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (!TELEGRAM_BOT_TOKEN) {
    console.error("TELEGRAM_BOT_TOKEN is not configured.");
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }

  try {
    const update: TelegramUpdate = await req.json();
    
    // Si no es un mensaje, respondemos ACK 200 rápido para que TG no reintente
    if (!update.message || !update.message.from || !update.message.chat) {
      return NextResponse.json({ ok: true });
    }

    const { text, voice, from, chat, message_id } = update.message;
    const updateId = String(update.update_id);
    const tgUserId = String(from.id);
    const tgChatId = String(chat.id);
    const tgUsername = from.username || from.first_name;
    const botLocale = from.language_code || "en";
    
    const supabaseAdmin = createAdminClient();

    // 2. Check Idempotency based on update_id
    const { data: existingEvent } = await supabaseAdmin
      .schema("public")
      .from("messaging_events")
      .select("id")
      .eq("provider", "telegram")
      .eq("external_event_id", updateId)
      .maybeSingle();

    if (existingEvent) {
      // Event already processed
      return NextResponse.json({ ok: true, note: "Already processed" });
    }

    // Helper: Send text back to Telegram Chat
    const sendReply = async (messageText: string) => {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: tgChatId, text: messageText }),
      });
    };

    // 3. User Resolution / Account Linking check
    // If the message is a Start command with a linking token (e.g., "/start abc123def")
    if (text && text.startsWith("/start ")) {
      const token = text.split(" ")[1];
      
      const { data: tokenData, error: tokenError } = await supabaseAdmin
        .schema("public")
        .from("channel_link_tokens")
        .select("user_id, expires_at")
        .eq("token", token)
        .eq("provider", "telegram")
        .is("used_at", null)
        .maybeSingle();

      if (tokenData && new Date(tokenData.expires_at) > new Date()) {
        // Link Account
        await supabaseAdmin
          .schema("public")
          .from("channel_links")
          .upsert({
            user_id: tokenData.user_id,
            provider: "telegram",
            provider_user_id: tgUserId,
            provider_chat_id: tgChatId,
            provider_username: tgUsername,
            bot_locale: botLocale,
            status: "active",
            linked_at: new Date().toISOString()
          }, { onConflict: "user_id, provider" });

        // Mark token used
        await supabaseAdmin
          .schema("public")
          .from("channel_link_tokens")
          .update({ used_at: new Date().toISOString() })
          .eq("token", token);

        await sendReply("✅ ¡Tu cuenta ha sido vinculada con éxito a Recall.bio!\nA partir de ahora, enviaré aquí tu pregunta diaria. Puedes responderme con texto o una nota de voz corta.");
        
        await supabaseAdmin.schema("public").from("messaging_events").insert({
          provider: "telegram", direction: "inbound", external_event_id: updateId,
          user_id: tokenData.user_id, provider_chat_id: tgChatId, message_type: "command", status: "processed"
        });
        return NextResponse.json({ ok: true });
      } else {
        await sendReply("❌ El enlace ha expirado o no es válido. Genéralo de nuevo desde Configuración en la web.");
        return NextResponse.json({ ok: true });
      }
    }

    // Identify user in our DB
    const { data: linkData } = await supabaseAdmin
      .schema("public")
      .from("channel_links")
      .select("user_id, status")
      .eq("provider", "telegram")
      .eq("provider_user_id", tgUserId)
      .maybeSingle();

    if (!linkData || !linkData.user_id) {
      if (text === "/start" || text === "/login") {
        // Bot-first onboarding message
        await sendReply("👋 Hola! Soy Recall.bio. Para guardar tus recuerdos diarios aquí, conecta primero tu cuenta iniciando sesión en el siguiente enlace:\n\n🔗 https://app.recall.bio/settings");
      } else {
        await sendReply("No tienes cuenta conectada. Ve a Configuración de Recall.bio y vincula tu cuenta de Telegram.");
      }
      return NextResponse.json({ ok: true });
    }

    const userId = linkData.user_id;

    if (linkData.status === "paused") {
      if (text === "/resume") {
        await supabaseAdmin.schema("public").from("channel_links").update({ status: "active" }).eq("user_id", userId).eq("provider", "telegram");
        await sendReply("▶️ Recordatorios reanudados.");
      } else {
        await sendReply("Tus recolectas están en pausa. Escribe /resume para continuar.");
      }
      return NextResponse.json({ ok: true });
    }

    // Process other commands
    if (text) {
      if (text === "/pause") {
        await supabaseAdmin.schema("public").from("channel_links").update({ status: "paused" }).eq("user_id", userId).eq("provider", "telegram");
        await sendReply("⏸️ Recordatorios pausados. Escribe /resume para volver.");
        return NextResponse.json({ ok: true });
      }
      if (text === "/help") {
        await sendReply("Puedes enviarme un mensaje de texto o una nota de voz en cualquier momento. \nMe aseguraré de guardarlo, pasarlo a texto y organizarlo en tu archivo web.\nComandos: /pause, /resume, /today");
        return NextResponse.json({ ok: true });
      }
    }

    await supabaseAdmin
      .schema("public")
      .from("channel_links")
      .update({ last_inbound_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("provider", "telegram");

    if (!text && !voice) {
       await sendReply("Solo entiendo texto o notas de voz por el momento.");
       return NextResponse.json({ ok: true });
    }

    // Find the right local date for the user
    const { data: profile } = await supabaseAdmin
      .schema("public")
      .from("profiles")
      .select("timezone")
      .eq("id", userId)
      .maybeSingle();
      
    const localDate = getLocalDateString(profile?.timezone);

    // Get the current daily prompt for the user if it exists and wasn't answered?
    // For MVP we just fetch the prompt for the day and assign the memory
    const promptService = new DailyPromptService(supabaseAdmin);
    // Assigns or gets the current prompt assigned today
    const promptResult = await promptService.getOrAssignPrompt(userId, localDate, botLocale);
    
    let questionId: string | undefined = undefined;
    if (promptResult.status === "assigned") {
      questionId = promptResult.question_id;
    }

    // Create the generic memory root
    const { data: memory, error: memoryError } = await supabaseAdmin
      .schema("public")
      .from("memories")
      .insert({
        user_id: userId,
        prompt_date: localDate,
        question_id: questionId || null,
        content_text: text || null, // If text exists, store directly
        is_private: true,
        media_status: voice ? "transcribing" : "ready",
      })
      .select("id")
      .single();

    if (memoryError || !memory) {
      console.error("Error creating memory record", memoryError);
      return NextResponse.json({ error: "Failed memory" }, { status: 500 });
    }

    let mediaHandledCorrectly = true;

    // Support Voice Notes
    if (voice) {
      try {
        // 1. Get file path from Telegram
        const fileRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${voice.file_id}`);
        const fileData = await fileRes.json();
        
        if (fileData.ok && fileData.result.file_path) {
           // 2. Download from Telegram
           const downloadUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${fileData.result.file_path}`;
           const audioRes = await fetch(downloadUrl);
           const audioBlob = await audioRes.blob();

           const mediaFormat = voice.mime_type || "audio/ogg"; 
           const fileExtension = mediaFormat.includes("opus") || mediaFormat.includes("ogg") ? "ogg" : "webm";
           const fileName = `audio_${Date.now()}.${fileExtension}`;
           const filePath = `user/${userId}/memories/${memory.id}/${fileName}`;

           // 3. Upload to Supabase Storage with explicit MIME TYPE for Gemini
           const { error: uploadError } = await supabaseAdmin
             .storage
             .from("media")
             .upload(filePath, audioBlob, {
               contentType: mediaFormat, 
               upsert: false
             });

           if (!uploadError) {
             // 4. Create memory_media record
             const { data: mediaRecord, error: mError } = await supabaseAdmin
               .schema("public")
               .from("memory_media")
               .insert({
                 user_id: userId,
                 memory_id: memory.id,
                 kind: "audio",
                 file_path: filePath,
                 mime_type: mediaFormat,   // CRITICAL for Gemini transcription worker to know it's OGG
                 format: fileExtension,
                 size_bytes: voice.duration, // approximate, or use blob size
                 transcript_status: "pending"
               })
               .select("id")
               .single();

             if (mediaRecord && !mError) {
               // 5. Queue transcription ignoring user auth ctx
               const qResult = await queueMemoryTranscription(supabaseAdmin, userId, memory.id);
               if (!qResult.success) {
                  mediaHandledCorrectly = false;
                  console.error("Transcription queue failed:", qResult.error);
               }
             } else {
               mediaHandledCorrectly = false;
               console.error("Audio DB Row creation error", mError);
             }
           } else {
             mediaHandledCorrectly = false;
             console.error("Audio Upload error", uploadError);
           }
        } else {
           mediaHandledCorrectly = false;
        }
      } catch (err) {
        console.error("Critical error processing audio from telegram:", err);
        mediaHandledCorrectly = false;
      }
    }

    const eventStatus = mediaHandledCorrectly ? "processed" : "failed";

    await supabaseAdmin.schema("public").from("messaging_events").insert({
      provider: "telegram",
      direction: "inbound",
      external_event_id: updateId,
      user_id: userId,
      provider_chat_id: tgChatId,
      message_type: voice ? "voice" : "text",
      prompt_date: localDate,
      memory_id: memory.id,
      status: eventStatus,
    });

    if (mediaHandledCorrectly) {
       await sendReply("📝 Guardado en tu archivo web.");
    } else {
       await sendReply("⚠️ Hubo un pequeño problema procesando tu mensaje. Se ha guardado una copia pero la transcripción o el audio podrían tardar o haber fallado.");
    }

    return NextResponse.json({ ok: true });
    
  } catch (error) {
    console.error("Webhook processing error", error);
    // Usually return 200 to Telegram so they don't block us entirely on internal server issues,
    // but log it deeply.
    return NextResponse.json({ ok: true, notice: "Internal Error logged" });
  }
}
