/*
  # Add No End Date and Beneficiaries Count Fields

  1. Changes
    - Add `no_end_date` boolean column to convocatorias table
      - Default value: false
      - Indicates if the convocatoria has no closing date
    - Add `beneficiaries_count` integer column to convocatorias table
      - Default value: null
      - Stores the total number of beneficiaries when no_end_date is true
  
  2. Notes
    - When no_end_date is true, the end_date field is still stored but display shows "Hasta agotar beneficiarios"
    - The beneficiaries_count field is only relevant when no_end_date is true
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'convocatorias' AND column_name = 'no_end_date'
  ) THEN
    ALTER TABLE convocatorias ADD COLUMN no_end_date boolean DEFAULT false;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'convocatorias' AND column_name = 'beneficiaries_count'
  ) THEN
    ALTER TABLE convocatorias ADD COLUMN beneficiaries_count integer;
  END IF;
END $$;