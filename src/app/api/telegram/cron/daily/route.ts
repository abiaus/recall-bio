import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { DailyPromptService } from "@/server/services/prompts/dailyPromptService";
import { getLocalDateString } from "@/utils/dateUtils";

const TELEGRAM_CRON_SECRET = process.env.TELEGRAM_CRON_SECRET || process.env.TELEGRAM_WEBHOOK_SECRET_TOKEN;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

/**
 * Cron entrypoint to send daily prompts to active Telegram users.
 * Should be triggered frequently (e.g. hourly) to catch users as they cross into new days.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (TELEGRAM_CRON_SECRET && authHeader !== `Bearer ${TELEGRAM_CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!TELEGRAM_BOT_TOKEN) {
    return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN missing" }, { status: 500 });
  }

  const supabaseAdmin = createAdminClient();
  const promptService = new DailyPromptService(supabaseAdmin);

  // Get all active telegram subscriptions
  const { data: links, error: linksError } = await supabaseAdmin
    .schema("public")
    .from("channel_links")
    .select("user_id, provider_chat_id, bot_locale, profiles!inner(timezone)")
    .eq("provider", "telegram")
    .eq("status", "active");

  if (linksError || !links) {
    console.error("Error fetching active telegram links:", linksError);
    return NextResponse.json({ error: "DB Error" }, { status: 500 });
  }

  let sentCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const link of links) {
    try {
      const tz = Array.isArray(link.profiles) ? link.profiles[0]?.timezone : (link.profiles as any)?.timezone;
      const localDate = getLocalDateString(tz);
      const locale = link.bot_locale || "en";

      // 1. Check if we already sent an outbound message for this user today
      const { data: alreadySent } = await supabaseAdmin
        .schema("public")
        .from("messaging_events")
        .select("id")
        .eq("user_id", link.user_id)
        .eq("provider", "telegram")
        .eq("direction", "outbound")
        .eq("prompt_date", localDate)
        .eq("message_type", "prompt")
        .maybeSingle();

      if (alreadySent) {
        skippedCount++;
        continue; // Next user
      }

      // 2. We haven't sent today. Assign or get today's prompt.
      const promptResult = await promptService.getOrAssignPrompt(link.user_id, localDate, locale);
      
      if (promptResult.status === "assigned") {
        const textToSend = `📅 Pregunta Diaria de Recall:\n\n*${promptResult.text}*`;
        
        // 3. Send via Telegram Bot API
        const tgRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
             chat_id: link.provider_chat_id,
             text: textToSend,
             parse_mode: "Markdown"
          }),
        });

        const tgData = await tgRes.json();

        // 4. Log the event if successful
        if (tgData.ok) {
          await supabaseAdmin.schema("public").from("messaging_events").insert({
            provider: "telegram",
            direction: "outbound",
            message_type: "prompt",
            user_id: link.user_id,
            provider_chat_id: String(link.provider_chat_id),
            prompt_date: localDate,
            status: "processed",
            external_event_id: String(tgData.result?.message_id || Date.now())
          });

          await supabaseAdmin
             .schema("public")
             .from("channel_links")
             .update({ last_outbound_at: new Date().toISOString() })
             .eq("user_id", link.user_id)
             .eq("provider", "telegram");

          sentCount++;
        } else {
          console.error("TG API error for user", link.user_id, tgData);
          
          // Log failed outbound
          await supabaseAdmin.schema("public").from("messaging_events").insert({
            provider: "telegram", direction: "outbound", message_type: "prompt",
            user_id: link.user_id, provider_chat_id: String(link.provider_chat_id), 
            prompt_date: localDate, status: "failed"
          });
          errorCount++;
        }
      } else {
        skippedCount++; // No questions available or error
      }
    } catch (err) {
      console.error(`Failed to process daily cron for user ${link.user_id}:`, err);
      errorCount++;
    }
  }

  return NextResponse.json({
    ok: true,
    processed: links.length,
    sent: sentCount,
    skipped: skippedCount,
    errors: errorCount
  });
}
