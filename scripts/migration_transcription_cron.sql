-- Migration: cron job for async transcription worker
-- Replace placeholders before execution:
--   <SUPABASE_PROJECT_REF>
--   <SUPABASE_ANON_KEY>

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Remove previous schedule if it exists
SELECT cron.unschedule(jobid)
FROM cron.job
WHERE jobname = 'transcribe_pending_audio';

-- Run every 2 minutes
SELECT cron.schedule(
  'transcribe_pending_audio',
  '*/2 * * * *',
  $$
    SELECT net.http_post(
      url := 'https://<SUPABASE_PROJECT_REF>.supabase.co/functions/v1/transcribe-audio',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer <SUPABASE_ANON_KEY>'
      ),
      body := '{"batchSize":5}'::jsonb
    ) AS request_id;
  $$
);
