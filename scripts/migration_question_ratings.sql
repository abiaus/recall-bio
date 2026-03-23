-- Migration: create question_ratings table for collaborative prompt quality scoring

CREATE TABLE IF NOT EXISTS public.question_ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  difficulty_to_answer SMALLINT NOT NULL CHECK (difficulty_to_answer BETWEEN 1 AND 5),
  clarity SMALLINT NOT NULL CHECK (clarity BETWEEN 1 AND 5),
  correct_category BOOLEAN NOT NULL,
  rated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_question_ratings_user_id
  ON public.question_ratings (user_id);

CREATE INDEX IF NOT EXISTS idx_question_ratings_question_id
  ON public.question_ratings (question_id);

ALTER TABLE public.question_ratings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own question ratings" ON public.question_ratings;
DROP POLICY IF EXISTS "Users can insert their own question ratings" ON public.question_ratings;
DROP POLICY IF EXISTS "Users can update their own question ratings" ON public.question_ratings;

CREATE POLICY "Users can view their own question ratings"
ON public.question_ratings FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own question ratings"
ON public.question_ratings FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own question ratings"
ON public.question_ratings FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
