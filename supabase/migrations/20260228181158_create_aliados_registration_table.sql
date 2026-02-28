/*
  # Create Aliados Registration Table

  1. New Tables
    - `aliados_registrations`
      - `id` (uuid, primary key) - Unique identifier for each registration
      - `company_name` (text) - Name of the company
      - `nit` (text) - Tax identification number (NIT)
      - `sector` (text) - Sector or industry
      - `city` (text) - City location
      - `phone` (text) - Contact phone number
      - `email` (text) - Contact email
      - `created_at` (timestamptz) - Timestamp of registration
      - `updated_at` (timestamptz) - Timestamp of last update

  2. Security
    - Enable RLS on `aliados_registrations` table
    - Add policy for public to insert their own registrations
    - Add policy for authenticated users to read all registrations
*/

CREATE TABLE IF NOT EXISTS aliados_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  nit text NOT NULL,
  sector text NOT NULL,
  city text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE aliados_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can register as aliado"
  ON aliados_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all registrations"
  ON aliados_registrations
  FOR SELECT
  TO authenticated
  USING (true);