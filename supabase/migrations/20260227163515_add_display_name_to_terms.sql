/*
  # Add Display Name to Terms Attachments

  1. Changes
    - Add `display_name` column to `convocatoria_terms` table
    - This allows admins to give custom names to attachments for display purposes
    - Column is optional and defaults to the original file_name if not provided

  2. Notes
    - Existing records will use their file_name as display_name by default
    - New records can specify a custom display name
*/

-- Add display_name column to convocatoria_terms
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'convocatoria_terms' AND column_name = 'display_name'
  ) THEN
    ALTER TABLE convocatoria_terms ADD COLUMN display_name text;
  END IF;
END $$;