-- Migration: Enable RLS and add read policy for questions table
-- Execute this in Supabase SQL Editor
--
-- This ensures authenticated users can read questions (needed for daily prompts)

-- Step 1: Enable RLS on questions (if not already enabled)
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop existing policy if it exists (to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can read active questions" ON public.questions;
DROP POLICY IF EXISTS "Authenticated users can read questions" ON public.questions;

-- Step 3: Create SELECT policy - authenticated users can read all active questions
CREATE POLICY "Authenticated users can read questions"
ON public.questions
FOR SELECT
TO authenticated
USING (true);

-- Verify RLS is enabled and policies exist:
-- SELECT tablename, policyname, permissive, roles, cmd, qual, with_check
-- FROM pg_policies
-- WHERE tablename = 'questions';
