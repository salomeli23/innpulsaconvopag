/*
  # Fix Authentication Schema Error

  1. Changes
    - Removes the auto_close RPC call requirement for admin panel
    - Updates function to be callable without causing auth errors
    - Ensures proper schema access for all roles

  2. Security
    - Maintains RLS policies
    - Ensures anon and authenticated can access necessary functions
*/

-- Recreate the function with proper security context
DROP FUNCTION IF EXISTS auto_close_expired_convocatorias();

CREATE OR REPLACE FUNCTION auto_close_expired_convocatorias()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION auto_close_expired_convocatorias() TO anon;
GRANT EXECUTE ON FUNCTION auto_close_expired_convocatorias() TO authenticated;

COMMENT ON FUNCTION auto_close_expired_convocatorias() IS 'Automatically closes convocatorias that have passed their end date';
