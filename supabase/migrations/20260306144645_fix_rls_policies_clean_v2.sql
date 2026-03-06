/*
  # Fix RLS Policies - Clean Slate

  1. Changes
    - Drop ALL existing policies on convocatorias table
    - Recreate clean, working policies
    - Ensure public read access works correctly

  2. Security
    - Public (anon) users can SELECT from convocatorias
    - Authenticated users can INSERT, UPDATE, DELETE convocatorias
*/

-- Drop ALL existing policies on convocatorias
DROP POLICY IF EXISTS "Anyone can view convocatorias" ON convocatorias;
DROP POLICY IF EXISTS "Admins can insert convocatorias" ON convocatorias;
DROP POLICY IF EXISTS "Admins can update convocatorias" ON convocatorias;
DROP POLICY IF EXISTS "Admins can delete convocatorias" ON convocatorias;
DROP POLICY IF EXISTS "Authenticated users can insert convocatorias" ON convocatorias;
DROP POLICY IF EXISTS "Authenticated users can update convocatorias" ON convocatorias;
DROP POLICY IF EXISTS "Authenticated users can delete convocatorias" ON convocatorias;

-- Create clean policies for convocatorias
CREATE POLICY "Public read access"
  ON convocatorias
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated insert access"
  ON convocatorias
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated update access"
  ON convocatorias
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated delete access"
  ON convocatorias
  FOR DELETE
  TO authenticated
  USING (true);
