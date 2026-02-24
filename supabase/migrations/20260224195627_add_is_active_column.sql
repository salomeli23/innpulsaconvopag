/*
  # Add is_active Column to Convocatorias

  1. Changes
    - Add `is_active` (boolean) column to convocatorias table
    - Default value is `true` so all existing convocatorias remain visible
    - When `false`, the convocatoria will be hidden from public view
    
  2. Purpose
    - Allows administrators to hide/deactivate convocatorias without deleting them
    - Preserves data while controlling visibility
    - Can be easily reactivated if needed
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'convocatorias' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE convocatorias ADD COLUMN is_active boolean DEFAULT true NOT NULL;
  END IF;
END $$;
