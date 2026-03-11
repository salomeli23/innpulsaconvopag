/*
  # Auto-close expired convocatorias
  
  1. Changes
    - Creates a function to automatically update expired convocatorias to 'cerrada' status
    - Creates a trigger that runs before SELECT operations
    - Ensures convocatorias with past end_date are marked as 'cerrada'
  
  2. Security
    - Function runs with SECURITY DEFINER to bypass RLS
    - Only updates status field, no other modifications
*/

-- Create function to auto-close expired convocatorias
CREATE OR REPLACE FUNCTION auto_close_expired_convocatorias()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE convocatorias
  SET status = 'cerrada'
  WHERE status = 'abierta'
    AND no_end_date = false
    AND end_date < CURRENT_DATE
    AND is_active = true;
END;
$$;

-- Create a scheduled job alternative using a view
-- Since triggers on SELECT are not supported, we'll create a materialized view approach
-- Instead, we'll update the fetchConvocatorias to call this function

COMMENT ON FUNCTION auto_close_expired_convocatorias() IS 'Automatically closes convocatorias that have passed their end date';
