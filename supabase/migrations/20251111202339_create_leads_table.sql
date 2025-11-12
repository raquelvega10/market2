/*
  # Create leads table for contact form

  1. New Tables
    - `leads`
      - `id` (uuid, primary key)
      - `nombre` (text)
      - `email` (text)
      - `telefono` (text, nullable)
      - `mensaje` (text)
      - `estado` (text, default 'nuevo')
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on `leads` table
    - Add policy for anonymous users to insert leads
    - Add policy for authenticated users to read all leads
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  email text NOT NULL,
  telefono text,
  mensaje text NOT NULL,
  estado text DEFAULT 'nuevo',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit contact form
CREATE POLICY "Anyone can submit contact form"
  ON leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated users can view leads
CREATE POLICY "Authenticated users can view leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING (true);
