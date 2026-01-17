-- Migration: Support multiple daily prompts per user per day
-- Execute this in Supabase SQL Editor
-- 
-- This migration adds a prompt_index column to allow users to generate
-- multiple questions on the same day, with each prompt being persisted.

-- Step 1: Add prompt_index column with default value of 1
ALTER TABLE public.daily_prompts 
ADD COLUMN IF NOT EXISTS prompt_index int NOT NULL DEFAULT 1;

-- Step 2: Update existing rows to ensure they all have prompt_index = 1
-- This handles any existing data that might not have the default applied
UPDATE public.daily_prompts 
SET prompt_index = 1 
WHERE prompt_index IS NULL OR prompt_index < 1;

-- Step 3: Drop existing unique constraint if it exists (various possible names)
-- We need to check and drop constraints that enforce uniqueness on (user_id, prompt_date)
DO $$ 
DECLARE
    constraint_name text;
BEGIN
    -- Find and drop any unique constraint on (user_id, prompt_date)
    FOR constraint_name IN 
        SELECT conname 
        FROM pg_constraint 
        WHERE conrelid = 'public.daily_prompts'::regclass
        AND contype = 'u'
        AND (
            -- Check if constraint involves both user_id and prompt_date
            EXISTS (
                SELECT 1 FROM unnest(conkey) AS col_idx
                JOIN pg_attribute ON pg_attribute.attrelid = conrelid AND pg_attribute.attnum = col_idx
                WHERE pg_attribute.attname IN ('user_id', 'prompt_date')
            )
        )
    LOOP
        EXECUTE format('ALTER TABLE public.daily_prompts DROP CONSTRAINT IF EXISTS %I', constraint_name);
        RAISE NOTICE 'Dropped constraint: %', constraint_name;
    END LOOP;
END $$;

-- Step 4: Create new unique constraint on (user_id, prompt_date, prompt_index)
-- This allows multiple prompts per day, each with a unique index
CREATE UNIQUE INDEX IF NOT EXISTS daily_prompts_user_date_index_unique 
ON public.daily_prompts (user_id, prompt_date, prompt_index);

-- Step 5: Add index for efficient querying of latest prompt by date
CREATE INDEX IF NOT EXISTS daily_prompts_user_date_index_idx 
ON public.daily_prompts (user_id, prompt_date, prompt_index DESC);

-- Verify the changes:
-- SELECT column_name, data_type, column_default
-- FROM information_schema.columns 
-- WHERE table_schema = 'public' AND table_name = 'daily_prompts' 
-- ORDER BY ordinal_position;

-- Test query to verify multiple prompts per day work:
-- SELECT user_id, prompt_date, prompt_index, question_id, created_at
-- FROM public.daily_prompts
-- WHERE user_id = 'your-user-id-here'
-- ORDER BY prompt_date DESC, prompt_index DESC;
