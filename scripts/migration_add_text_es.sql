-- Migration: Add text_es column to questions table for Spanish translations
-- Execute this in Supabase SQL Editor

ALTER TABLE public.questions 
ADD COLUMN IF NOT EXISTS text_es text;

-- Optional: Add index for faster locale-based queries (if needed later)
-- CREATE INDEX IF NOT EXISTS questions_text_es_idx ON public.questions (text_es) WHERE text_es IS NOT NULL;

-- Verify the column was added:
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_schema = 'public' AND table_name = 'questions' AND column_name = 'text_es';
