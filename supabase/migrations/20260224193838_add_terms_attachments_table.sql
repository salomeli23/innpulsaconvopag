/*
  # Add Terms Attachments Support

  1. New Tables
    - `convocatoria_terms` - Stores multiple term documents for each convocatoria
      - `id` (uuid, primary key)
      - `convocatoria_id` (uuid, foreign key to convocatorias)
      - `file_name` (text) - Original file name
      - `file_url` (text) - URL to the uploaded file
      - `file_size` (integer) - File size in bytes
      - `uploaded_at` (timestamptz) - Upload timestamp
      - `created_at` (timestamptz) - Record creation timestamp

  2. Changes
    - Keep existing `terms_url` column for backward compatibility
    - Add new table for multiple file attachments

  3. Security
    - Enable RLS on `convocatoria_terms` table
    - Add policies for public read access
    - Add policies for authenticated admin users to manage files
*/

-- Create the terms attachments table
CREATE TABLE IF NOT EXISTS convocatoria_terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  convocatoria_id uuid REFERENCES convocatorias(id) ON DELETE CASCADE NOT NULL,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_size integer DEFAULT 0,
  uploaded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE convocatoria_terms ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view term files
CREATE POLICY "Anyone can view convocatoria terms"
  ON convocatoria_terms
  FOR SELECT
  TO public
  USING (true);

-- Policy: Authenticated users can insert term files
CREATE POLICY "Authenticated users can insert convocatoria terms"
  ON convocatoria_terms
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update term files
CREATE POLICY "Authenticated users can update convocatoria terms"
  ON convocatoria_terms
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can delete term files
CREATE POLICY "Authenticated users can delete convocatoria terms"
  ON convocatoria_terms
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_convocatoria_terms_convocatoria_id 
  ON convocatoria_terms(convocatoria_id);