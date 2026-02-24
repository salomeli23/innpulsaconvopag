/*
  # Enable Authentication and Admin Policies

  1. Security Changes
    - Update RLS policies on convocatorias table
    - Add policy for public read access
    - Add policy for authenticated admin users to manage convocatorias
    - Create admin check function

  2. Notes
    - Public users can view all convocatorias (existing behavior)
    - Only authenticated users with admin role can insert, update, or delete convocatorias
    - Admin role will be stored in auth.users metadata
*/

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT COALESCE(
      (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean,
      false
    )
  );
END;
$$;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can view convocatorias" ON convocatorias;
DROP POLICY IF EXISTS "Admins can insert convocatorias" ON convocatorias;
DROP POLICY IF EXISTS "Admins can update convocatorias" ON convocatorias;
DROP POLICY IF EXISTS "Admins can delete convocatorias" ON convocatorias;

-- Create new policies
CREATE POLICY "Anyone can view convocatorias"
  ON convocatorias
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert convocatorias"
  ON convocatorias
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update convocatorias"
  ON convocatorias
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete convocatorias"
  ON convocatorias
  FOR DELETE
  TO authenticated
  USING (is_admin());