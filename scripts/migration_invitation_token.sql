-- Migration: Add invitation_token to legacy_access table
-- This allows secure invitation links with tokens instead of requiring login first

ALTER TABLE public.legacy_access 
ADD COLUMN IF NOT EXISTS invitation_token uuid DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS invitation_expires_at timestamptz DEFAULT (now() + interval '30 days');

-- Create unique index for fast token lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_legacy_access_invitation_token 
ON public.legacy_access(invitation_token) WHERE invitation_token IS NOT NULL;

-- Add index for expiration checks
CREATE INDEX IF NOT EXISTS idx_legacy_access_invitation_expires_at 
ON public.legacy_access(invitation_expires_at) WHERE invitation_token IS NOT NULL;

-- Update existing records to have tokens (if any exist without tokens)
UPDATE public.legacy_access 
SET invitation_token = gen_random_uuid(),
    invitation_expires_at = now() + interval '30 days'
WHERE invitation_token IS NULL AND status = 'invited';
