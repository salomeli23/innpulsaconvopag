/*
  # Add Detailed Fields to Convocatorias

  1. Changes
    - Add `start_time` (text) - Hora de inicio (e.g., "3:00 pm")
    - Add `end_time` (text) - Hora de cierre (e.g., "11:59 pm")
    - Add `registration_url` (text) - URL del botón "Inscríbete aquí"
    - Add `target_audience` (text) - ¿Para quién fue creada?
    - Add `purpose` (text) - ¿Para qué fue creada?
    - Add `benefits` (text) - ¿Qué beneficios ofrece?
    - Add `terms_url` (text) - URL de términos de referencia y/o proceso de selección
    
  2. Notes
    - All new fields are optional (nullable) to maintain compatibility with existing records
    - Times are stored as text to match the display format shown in the design
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'convocatorias' AND column_name = 'start_time'
  ) THEN
    ALTER TABLE convocatorias ADD COLUMN start_time text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'convocatorias' AND column_name = 'end_time'
  ) THEN
    ALTER TABLE convocatorias ADD COLUMN end_time text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'convocatorias' AND column_name = 'registration_url'
  ) THEN
    ALTER TABLE convocatorias ADD COLUMN registration_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'convocatorias' AND column_name = 'target_audience'
  ) THEN
    ALTER TABLE convocatorias ADD COLUMN target_audience text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'convocatorias' AND column_name = 'purpose'
  ) THEN
    ALTER TABLE convocatorias ADD COLUMN purpose text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'convocatorias' AND column_name = 'benefits'
  ) THEN
    ALTER TABLE convocatorias ADD COLUMN benefits text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'convocatorias' AND column_name = 'terms_url'
  ) THEN
    ALTER TABLE convocatorias ADD COLUMN terms_url text;
  END IF;
END $$;