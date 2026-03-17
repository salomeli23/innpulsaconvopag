/*
  # Optimize Database Performance

  1. Changes
    - Add pg_cron extension for scheduled tasks
    - Create scheduled job to auto-close expired convocatorias every hour
    - Add composite indexes for better query performance
    - Optimize status update process
  
  2. Performance Improvements
    - Removes need for manual RPC calls from frontend
    - Automatic background processing
    - Better index coverage for common queries
  
  3. Security
    - Scheduled jobs run with appropriate permissions
    - No changes to RLS policies
*/

-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Drop existing scheduled jobs if any
DO $$
BEGIN
  PERFORM cron.unschedule('auto-close-convocatorias');
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- Schedule the auto-close function to run every hour
SELECT cron.schedule(
  'auto-close-convocatorias',
  '0 * * * *', -- Every hour at minute 0
  'SELECT auto_close_expired_convocatorias();'
);

-- Add a composite index for the most common query pattern
DROP INDEX IF EXISTS idx_convocatorias_active_status_date;
CREATE INDEX IF NOT EXISTS idx_convocatorias_active_status_date 
ON convocatorias (is_active, status, end_date DESC) 
WHERE is_active = true;

-- Add index for end_date filtering (used by auto_close function)
CREATE INDEX IF NOT EXISTS idx_convocatorias_end_date 
ON convocatorias (end_date) 
WHERE status = 'abierta' AND no_end_date = false AND is_active = true;

-- Analyze tables to update statistics
ANALYZE convocatorias;
ANALYZE convocatoria_terms;

COMMENT ON FUNCTION auto_close_expired_convocatorias() IS 'Automatically closes convocatorias that have passed their end date. Runs hourly via pg_cron.';
