/*
  # Create categories table

  1. New Tables
    - `categories`
      - `id` (uuid, primary key, default gen_random_uuid())
      - `name` (text, unique, not null)
      - `created_at` (timestamp, default now())
  2. Security
    - Enable RLS on `categories` table
    - Add policy for all users to read categories
  3. Initial Data
    - Inserts default categories: 'Roupas', 'Acessórios', 'Calçados', 'Brinquedos'.
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to categories"
  ON categories
  FOR SELECT
  TO public
  USING (true);

INSERT INTO categories (name)
VALUES
  ('Roupas'),
  ('Acessórios'),
  ('Calçados'),
  ('Brinquedos')
ON CONFLICT (name) DO NOTHING;
