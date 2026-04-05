-- Migration: Telegram Capture Foundation
-- Creates tables and updates profiles for the MVP.

-- Enable required extension
CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;

-- 1. Updates to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS daily_prompt_time_local TIME,
  ADD COLUMN IF NOT EXISTS telegram_reminder_enabled BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS preferred_capture_channel TEXT DEFAULT 'web';

-- 2. Channel Links / Telegram Links
CREATE TABLE IF NOT EXISTS public.channel_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider TEXT NOT NULL, -- e.g. 'telegram', 'whatsapp'
    provider_user_id TEXT NOT NULL,
    provider_chat_id TEXT,
    provider_username TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'active', 'paused', 'revoked'
    bot_locale TEXT,
    linked_at TIMESTAMPTZ,
    last_inbound_at TIMESTAMPTZ,
    last_outbound_at TIMESTAMPTZ,
    last_prompt_date_sent DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, provider),
    UNIQUE(provider, provider_user_id)
);

-- Index for cron lookups
CREATE INDEX IF NOT EXISTS idx_channel_links_status_provider ON public.channel_links(status, provider);

-- 3. Link Tokens for linking accounts
CREATE TABLE IF NOT EXISTS public.channel_link_tokens (
    token TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ
);

-- 4. Messaging events (audit & idempotency)
CREATE TABLE IF NOT EXISTS public.messaging_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    provider TEXT NOT NULL,
    direction TEXT NOT NULL, -- 'inbound' or 'outbound'
    external_event_id TEXT, -- e.g. update_id in Telegram for idempotency
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    provider_chat_id TEXT,
    message_type TEXT, -- 'text', 'voice', 'photo'
    prompt_date DATE,
    memory_id UUID REFERENCES public.memories(id) ON DELETE SET NULL,
    status TEXT NOT NULL, -- 'processed', 'failed', 'ignored', 'sent'
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure external events are unique to avoid duplicate processing
CREATE UNIQUE INDEX IF NOT EXISTS idx_messaging_events_external_id ON public.messaging_events(provider, external_event_id) WHERE external_event_id IS NOT NULL;

-- 5. Enable RLS on new tables
ALTER TABLE public.channel_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channel_link_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messaging_events ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies
-- channel_links
CREATE POLICY "Users can view own channel links"
  ON public.channel_links FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own channel links"
  ON public.channel_links FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own channel links"
  ON public.channel_links FOR DELETE
  USING (auth.uid() = user_id);

-- Link tokens
CREATE POLICY "Users can insert own link tokens"
  ON public.channel_link_tokens FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own link tokens"
  ON public.channel_link_tokens FOR SELECT
  USING (auth.uid() = user_id);

-- Messaging events
CREATE POLICY "Users can view own messaging events"
  ON public.messaging_events FOR SELECT
  USING (auth.uid() = user_id);

-- Note: Mutations for messaging_events and channel_links from webhooks 
-- will be handled using the Superbase Admin/Service Role client, 
-- which bypasses RLS naturally.

-- 7. Add updated_at trigger for channel_links
CREATE TRIGGER handle_updated_at_channel_links
  BEFORE UPDATE ON public.channel_links
  FOR EACH ROW
  EXECUTE PROCEDURE moddatetime (updated_at);
