-- Migration: RLS policies for memories and memory_media tables
-- Execute this ENTIRE script in Supabase SQL Editor
--
-- This fixes "permission denied" errors for memories and media storage.

-- ============================================
-- 1. MEMORIES TABLE
-- ============================================
-- Grant permissions to authenticated users (required for RLS to work)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.memories TO authenticated;

ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own memories" ON public.memories;
DROP POLICY IF EXISTS "Users can insert their own memories" ON public.memories;
DROP POLICY IF EXISTS "Users can update their own memories" ON public.memories;
DROP POLICY IF EXISTS "Users can delete their own memories" ON public.memories;

-- Create policies for memories
CREATE POLICY "Users can view their own memories"
ON public.memories FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own memories"
ON public.memories FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memories"
ON public.memories FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memories"
ON public.memories FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- ============================================
-- 2. MEMORY_MEDIA TABLE
-- ============================================
-- Grant permissions to authenticated users (required for RLS to work)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.memory_media TO authenticated;

ALTER TABLE public.memory_media ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own media" ON public.memory_media;
DROP POLICY IF EXISTS "Users can insert their own media" ON public.memory_media;
DROP POLICY IF EXISTS "Users can update their own media" ON public.memory_media;
DROP POLICY IF EXISTS "Users can delete their own media" ON public.memory_media;

-- Create policies for memory_media
CREATE POLICY "Users can view their own media"
ON public.memory_media FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own media"
ON public.memory_media FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own media"
ON public.memory_media FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own media"
ON public.memory_media FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- ============================================
-- 3. STORAGE BUCKET POLICIES FOR MEDIA
-- ============================================
-- First ensure the bucket exists (run once in Supabase dashboard or via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', false)
-- ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if any
DROP POLICY IF EXISTS "Users can upload their own media" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own media" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own media" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own media" ON storage.objects;

-- Storage: Users can upload files to their own folder
CREATE POLICY "Users can upload their own media"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
    bucket_id = 'media' AND
    (storage.foldername(name))[1] = 'user' AND
    (storage.foldername(name))[2] = auth.uid()::text
);

-- Storage: Users can view their own files
CREATE POLICY "Users can view their own media"
ON storage.objects FOR SELECT TO authenticated
USING (
    bucket_id = 'media' AND
    (storage.foldername(name))[1] = 'user' AND
    (storage.foldername(name))[2] = auth.uid()::text
);

-- Storage: Users can update their own files
CREATE POLICY "Users can update their own media"
ON storage.objects FOR UPDATE TO authenticated
USING (
    bucket_id = 'media' AND
    (storage.foldername(name))[1] = 'user' AND
    (storage.foldername(name))[2] = auth.uid()::text
);

-- Storage: Users can delete their own files
CREATE POLICY "Users can delete their own media"
ON storage.objects FOR DELETE TO authenticated
USING (
    bucket_id = 'media' AND
    (storage.foldername(name))[1] = 'user' AND
    (storage.foldername(name))[2] = auth.uid()::text
);

-- ============================================
-- VERIFICATION (run after to confirm)
-- ============================================
-- Check table policies:
-- SELECT tablename, policyname, cmd 
-- FROM pg_policies 
-- WHERE tablename IN ('memories', 'memory_media')
-- ORDER BY tablename, cmd;

-- Check storage policies:
-- SELECT policyname, cmd 
-- FROM pg_policies 
-- WHERE tablename = 'objects' AND schemaname = 'storage';
