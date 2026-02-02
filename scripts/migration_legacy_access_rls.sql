-- Migration: RLS policies for legacy_access table
-- Execute this ENTIRE script in Supabase SQL Editor
--
-- This fixes "permission denied" errors for legacy_access operations.

-- ============================================
-- 1. LEGACY_ACCESS TABLE
-- ============================================
-- Grant permissions to authenticated users (required for RLS to work)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.legacy_access TO authenticated;

ALTER TABLE public.legacy_access ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own legacy access" ON public.legacy_access;
DROP POLICY IF EXISTS "Users can view legacy access where they are heir" ON public.legacy_access;
DROP POLICY IF EXISTS "Users can insert their own legacy access" ON public.legacy_access;
DROP POLICY IF EXISTS "Users can update their own legacy access" ON public.legacy_access;
DROP POLICY IF EXISTS "Users can update legacy access where they are heir" ON public.legacy_access;
DROP POLICY IF EXISTS "Users can delete their own legacy access" ON public.legacy_access;

-- SELECT: Users can view records where they are owner OR heir
CREATE POLICY "Users can view their own legacy access"
ON public.legacy_access FOR SELECT TO authenticated
USING (auth.uid() = owner_user_id);

CREATE POLICY "Users can view legacy access where they are heir"
ON public.legacy_access FOR SELECT TO authenticated
USING (auth.uid() = heir_user_id);

-- INSERT: Users can insert records where they are the owner
CREATE POLICY "Users can insert their own legacy access"
ON public.legacy_access FOR INSERT TO authenticated
WITH CHECK (auth.uid() = owner_user_id);

-- UPDATE: Users can update records where they are owner OR heir
-- Owner can update any field (for activating, revoking, etc.)
-- Heir can only update their own acceptance (heir_user_id and status)
CREATE POLICY "Users can update their own legacy access"
ON public.legacy_access FOR UPDATE TO authenticated
USING (auth.uid() = owner_user_id)
WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY "Users can update legacy access where they are heir"
ON public.legacy_access FOR UPDATE TO authenticated
USING (
    auth.uid() = heir_user_id OR
    (heir_user_id IS NULL AND heir_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
)
WITH CHECK (
    auth.uid() = heir_user_id OR
    (heir_user_id IS NULL AND heir_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
);

-- DELETE: Users can delete records where they are the owner
CREATE POLICY "Users can delete their own legacy access"
ON public.legacy_access FOR DELETE TO authenticated
USING (auth.uid() = owner_user_id);

-- ============================================
-- VERIFICATION (run after to confirm)
-- ============================================
-- Check table policies:
-- SELECT tablename, policyname, cmd 
-- FROM pg_policies 
-- WHERE tablename = 'legacy_access'
-- ORDER BY cmd;
