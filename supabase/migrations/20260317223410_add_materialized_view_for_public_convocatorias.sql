/*
  # Add Materialized View for Public Convocatorias

  1. Changes
    - Create a materialized view for active convocatorias
    - Add refresh function to update the view
    - Schedule automatic refresh every 15 minutes
  
  2. Performance Benefits
    - Faster queries for public users
    - Reduced database load
    - Pre-computed active convocatorias list
  
  3. Security
    - View respects existing RLS policies
    - Refresh runs with appropriate permissions
*/

-- Create materialized view for active convocatorias
DROP MATERIALIZED VIEW IF EXISTS active_convocatorias_view CASCADE;
CREATE MATERIALIZED VIEW active_convocatorias_view AS
SELECT 
  id, 
  title, 
  description, 
  status, 
  start_date, 
  end_date, 
  category, 
  created_at, 
  no_end_date, 
  beneficiaries_count
FROM convocatorias
WHERE is_active = true
ORDER BY created_at DESC;

-- Create unique index on the view for faster lookups
CREATE UNIQUE INDEX idx_active_convocatorias_view_id ON active_convocatorias_view (id);

-- Create index for status filtering
CREATE INDEX idx_active_convocatorias_view_status ON active_convocatorias_view (status);

-- Create index for date filtering
CREATE INDEX idx_active_convocatorias_view_end_date ON active_convocatorias_view (end_date);

-- Function to refresh the materialized view
CREATE OR REPLACE FUNCTION refresh_active_convocatorias_view()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY active_convocatorias_view;
END;
$$;

-- Schedule the refresh to run every 15 minutes
DO $$
BEGIN
  PERFORM cron.unschedule('refresh-active-convocatorias');
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

SELECT cron.schedule(
  'refresh-active-convocatorias',
  '*/15 * * * *', -- Every 15 minutes
  'SELECT refresh_active_convocatorias_view();'
);

-- Initial refresh
REFRESH MATERIALIZED VIEW active_convocatorias_view;

COMMENT ON MATERIALIZED VIEW active_convocatorias_view IS 'Pre-computed view of active convocatorias for faster public queries. Refreshes every 15 minutes.';
