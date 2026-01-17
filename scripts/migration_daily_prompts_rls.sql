-- Migration: Enable RLS and add policies for daily_prompts table
-- Execute this in Supabase SQL Editor
--
-- This fixes the "permission denied for table daily_prompts" error
-- by allowing authenticated users to manage their own daily prompts.

-- Step 1: Enable RLS on daily_prompts (if not already enabled)
ALTER TABLE public.daily_prompts ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own daily prompts" ON public.daily_prompts;
DROP POLICY IF EXISTS "Users can insert their own daily prompts" ON public.daily_prompts;
DROP POLICY IF EXISTS "Users can update their own daily prompts" ON public.daily_prompts;
DROP POLICY IF EXISTS "Users can delete their own daily prompts" ON public.daily_prompts;

-- Step 3: Create SELECT policy - users can only see their own prompts
CREATE POLICY "Users can view their own daily prompts"
ON public.daily_prompts
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Step 4: Create INSERT policy - users can only insert prompts for themselves
CREATE POLICY "Users can insert their own daily prompts"
ON public.daily_prompts
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Step 5: Create UPDATE policy - users can only update their own prompts
CREATE POLICY "Users can update their own daily prompts"
ON public.daily_prompts
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Step 6: Create DELETE policy - users can only delete their own prompts
CREATE POLICY "Users can delete their own daily prompts"
ON public.daily_prompts
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Verify RLS is enabled and policies exist:
-- SELECT tablename, policyname, permissive, roles, cmd, qual, with_check
-- FROM pg_policies
-- WHERE tablename = 'daily_prompts';
