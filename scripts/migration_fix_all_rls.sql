-- Migration: Fix all RLS policies for the application
-- Execute this ENTIRE script in Supabase SQL Editor
--
-- This fixes "permission denied" errors by enabling RLS and creating
-- proper policies for all tables used by the daily prompts feature.

-- ============================================
-- 1. DAILY_PROMPTS TABLE
-- ============================================
ALTER TABLE public.daily_prompts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own daily prompts" ON public.daily_prompts;
DROP POLICY IF EXISTS "Users can insert their own daily prompts" ON public.daily_prompts;
DROP POLICY IF EXISTS "Users can update their own daily prompts" ON public.daily_prompts;
DROP POLICY IF EXISTS "Users can delete their own daily prompts" ON public.daily_prompts;

CREATE POLICY "Users can view their own daily prompts"
ON public.daily_prompts FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily prompts"
ON public.daily_prompts FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily prompts"
ON public.daily_prompts FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily prompts"
ON public.daily_prompts FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- ============================================
-- 2. QUESTIONS TABLE
-- ============================================
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read active questions" ON public.questions;
DROP POLICY IF EXISTS "Authenticated users can read questions" ON public.questions;

CREATE POLICY "Authenticated users can read questions"
ON public.questions FOR SELECT TO authenticated
USING (true);

-- ============================================
-- 3. PROFILES TABLE
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

-- ============================================
-- VERIFICATION (run after to confirm)
-- ============================================
-- SELECT tablename, policyname, cmd 
-- FROM pg_policies 
-- WHERE tablename IN ('daily_prompts', 'questions', 'profiles')
-- ORDER BY tablename, cmd;
