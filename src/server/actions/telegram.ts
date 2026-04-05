"use server";

import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

export type TelegramConnectionStatus = {
  linked: boolean;
  username?: string | null;
  status?: string | null;
  botLocale?: string | null;
};

export async function getTelegramConnectionStatus(): Promise<TelegramConnectionStatus> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { linked: false };
  }

  const { data, error } = await supabase
    .schema("public")
    .from("channel_links")
    .select("provider_username, status, bot_locale")
    .eq("user_id", user.id)
    .eq("provider", "telegram")
    .maybeSingle();

  if (error || !data) {
    return { linked: false };
  }

  return {
    linked: true,
    username: data.provider_username,
    status: data.status,
    botLocale: data.bot_locale,
  };
}

export async function generateTelegramLinkToken(): Promise<{
  success: boolean;
  deepLink?: string;
  error?: string;
}> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado" };
  }

  const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;
  if (!botUsername) {
    return { success: false, error: "Bot no configurado" };
  }

  // Generar token único seguro
  const token = crypto.randomBytes(32).toString('hex');
  
  // Establecer caducidad en 15 minutos
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 15);

  const { error } = await supabase
    .schema("public")
    .from("channel_link_tokens")
    .insert({
      token,
      user_id: user.id,
      provider: "telegram",
      expires_at: expiresAt.toISOString(),
    });

  if (error) {
    console.error("Error generating telegram link token:", error);
    return { success: false, error: "No se pudo generar el enlace" };
  }

  const deepLink = `https://t.me/${botUsername}?start=${token}`;
  
  return { success: true, deepLink };
}

export async function unlinkTelegram(): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado" };
  }

  const { error } = await supabase
    .schema("public")
    .from("channel_links")
    .delete()
    .eq("user_id", user.id)
    .eq("provider", "telegram");

  if (error) {
    console.error("Error unlinking telegram:", error);
    return { success: false, error: "Error al desvincular" };
  }

  return { success: true };
}

export async function toggleTelegramPause(pause: boolean): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado" };
  }

  const status = pause ? "paused" : "active";

  const { error } = await supabase
    .schema("public")
    .from("channel_links")
    .update({ status })
    .eq("user_id", user.id)
    .eq("provider", "telegram");

  if (error) {
    console.error("Error pausing telegram:", error);
    return { success: false, error: "Error al cambiar el estado" };
  }

  return { success: true };
}
