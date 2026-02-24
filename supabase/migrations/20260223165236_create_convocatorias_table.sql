/*
  # Create Convocatorias System

  1. New Tables
    - `convocatorias`
      - `id` (uuid, primary key)
      - `title` (text) - Standardized title
      - `description` (text) - Full description
      - `image_url` (text) - Image path
      - `status` (text) - 'abierta' or 'cerrada'
      - `start_date` (timestamptz) - Opening date
      - `end_date` (timestamptz) - Closing date
      - `category` (text) - Category type
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `convocatorias` table
    - Add policy for public read access (convocatorias are public information)
    - Add policy for authenticated users to manage convocatorias
*/

CREATE TABLE IF NOT EXISTS convocatorias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  status text NOT NULL CHECK (status IN ('abierta', 'cerrada')),
  start_date timestamptz NOT NULL DEFAULT now(),
  end_date timestamptz NOT NULL,
  category text NOT NULL DEFAULT 'convocatorias',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE convocatorias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view convocatorias"
  ON convocatorias
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert convocatorias"
  ON convocatorias
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update convocatorias"
  ON convocatorias
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete convocatorias"
  ON convocatorias
  FOR DELETE
  TO authenticated
  USING (true);

INSERT INTO convocatorias (title, description, image_url, status, end_date, category) VALUES
(
  'iNNpulsa Mujeres',
  'El programa "iNNpulsa Mujeres" busca impactar en el mejoramiento de habilidades blandas y duras de las mujeres de la economía popular y/o de poblaciones vulnerables, población migrante, colombianos retornados y comunidades de acogida; de igual forma, fortalecer las capacidades para la producción, comercialización y desarrollo de productos y/o servicios.',
  '/Contenido-Feb_Post-3-1.png',
  'abierta',
  '2026-03-15 23:59:59',
  'convocatorias'
),
(
  'Sostenibilidad para la Cadena de Valor del Turismo',
  'El Programa busca fortalecer la competitividad y la sostenibilidad ambiental de las unidades productivas, MiPymes, prestadores de servicios turísticos y organizaciones de base comunitaria en Colombia mediante asistencia técnica especializada, procesos de capacitación en sostenibilidad, productividad e innovación, y la implementación de proyectos de gestión ambiental orientados a reducir la huella ambiental.',
  '/Sostenibilidad.jpeg',
  'abierta',
  '2026-04-30 23:59:59',
  'convocatorias'
),
(
  'Oportunidades para Emprender',
  'Buscamos seleccionar unidades productivas beneficiarias del programa Oportunidades para Emprender, con el propósito de brindarles una ruta integral de acompañamiento que incluye diagnóstico, asistencia técnica especializada y fortalecimiento de capacidades productivas, comerciales, administrativas y organizacionales, orientadas a su sostenibilidad, crecimiento y conexión con el mercado.',
  '/gradient-blue',
  'abierta',
  '2026-02-27 23:59:59',
  'convocatorias'
);