-- Migration: enforce plan assignment and monthly limits by plan

-- Ensure all profiles have a valid plan
UPDATE public.profiles
SET plan = 'free'
WHERE plan IS NULL OR btrim(plan) = '';

ALTER TABLE public.profiles
ALTER COLUMN plan SET DEFAULT 'free';

ALTER TABLE public.profiles
ALTER COLUMN plan SET NOT NULL;

-- Ensure a baseline feature matrix for transcription limits
INSERT INTO public.plan_features (plan, feature_key, enabled, limit_value)
VALUES
  ('free', 'transcription', false, 0),
  ('pro', 'transcription', true, 200)
ON CONFLICT (plan, feature_key)
DO UPDATE SET
  enabled = EXCLUDED.enabled,
  limit_value = EXCLUDED.limit_value,
  updated_at = now();
