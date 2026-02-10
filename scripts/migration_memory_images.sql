-- Migration: Support for images in memories (memory_media.kind = 'image')
-- Run in Supabase SQL Editor
--
-- Ensures memory_media supports image kind and adds index for gallery queries.

-- Index for efficient gallery queries: load images by memory_id
CREATE INDEX IF NOT EXISTS idx_memory_media_memory_kind
ON public.memory_media (memory_id, kind);
