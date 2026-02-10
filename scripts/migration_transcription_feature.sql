-- Migration: transcription + feature flags
-- Run in Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ------------------------------
-- 1) Profiles: plan + language
-- ------------------------------
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free';

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS transcription_language TEXT DEFAULT 'en';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'profiles_transcription_language_check'
  ) THEN
    ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_transcription_language_check
    CHECK (transcription_language IN ('en', 'es', 'pt', 'fr', 'de', 'it', 'zh', 'ja', 'ko', 'ar'));
  END IF;
END $$;

COMMENT ON COLUMN public.profiles.transcription_language IS 'Preferred language code for audio transcription';
COMMENT ON COLUMN public.profiles.plan IS 'Subscription plan used for feature access checks';

-- ------------------------------
-- 2) Memory media transcript data
-- ------------------------------
ALTER TABLE public.memory_media
ADD COLUMN IF NOT EXISTS transcript TEXT;

ALTER TABLE public.memory_media
ADD COLUMN IF NOT EXISTS transcript_language TEXT;

ALTER TABLE public.memory_media
ADD COLUMN IF NOT EXISTS transcript_status TEXT DEFAULT 'pending';

ALTER TABLE public.memory_media
ADD COLUMN IF NOT EXISTS transcript_error TEXT;

ALTER TABLE public.memory_media
ADD COLUMN IF NOT EXISTS transcript_attempts INTEGER DEFAULT 0;

ALTER TABLE public.memory_media
ADD COLUMN IF NOT EXISTS transcript_updated_at TIMESTAMPTZ;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'memory_media_transcript_status_check'
  ) THEN
    ALTER TABLE public.memory_media
    ADD CONSTRAINT memory_media_transcript_status_check
    CHECK (transcript_status IN ('pending', 'processing', 'completed', 'failed'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_memory_media_transcript_status
ON public.memory_media (transcript_status);

CREATE INDEX IF NOT EXISTS idx_memory_media_user_kind
ON public.memory_media (user_id, kind);

-- ------------------------------
-- 3) Feature flags by plan + per-user override
-- ------------------------------
CREATE TABLE IF NOT EXISTS public.plan_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan TEXT NOT NULL,
  feature_key TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  limit_value INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(plan, feature_key)
);

CREATE TABLE IF NOT EXISTS public.user_feature_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_key TEXT NOT NULL,
  enabled BOOLEAN NOT NULL,
  limit_value INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, feature_key)
);

ALTER TABLE public.plan_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_feature_overrides ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.plan_features TO authenticated;
GRANT SELECT ON public.user_feature_overrides TO authenticated;

DROP POLICY IF EXISTS "Authenticated users can read plan features" ON public.plan_features;
CREATE POLICY "Authenticated users can read plan features"
ON public.plan_features
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Users can read their own feature overrides" ON public.user_feature_overrides;
CREATE POLICY "Users can read their own feature overrides"
ON public.user_feature_overrides
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Seed base plan features (idempotent)
INSERT INTO public.plan_features (plan, feature_key, enabled, limit_value)
VALUES
  ('free', 'transcription', false, NULL),
  ('pro', 'transcription', true, NULL)
ON CONFLICT (plan, feature_key)
DO UPDATE SET
  enabled = EXCLUDED.enabled,
  limit_value = EXCLUDED.limit_value,
  updated_at = now();
