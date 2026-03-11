/*
  # Grant permissions for RPC function
  
  1. Changes
    - Grants EXECUTE permission on auto_close_expired_convocatorias function to anon and authenticated roles
    - Allows the function to be called from the frontend
  
  2. Security
    - Function is SECURITY DEFINER so it runs with elevated privileges
    - Only performs safe UPDATE operation on convocatorias table
    - No data exposure risk
*/

-- Grant execute permissions to anon and authenticated users
GRANT EXECUTE ON FUNCTION auto_close_expired_convocatorias() TO anon;
GRANT EXECUTE ON FUNCTION auto_close_expired_convocatorias() TO authenticated;
