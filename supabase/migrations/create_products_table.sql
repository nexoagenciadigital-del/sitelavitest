/*
  # Create products table

  1. New Tables
    - `products`
      - `id` (uuid, primary key, default gen_random_uuid())
      - `name` (text, not null)
      - `description` (text)
      - `price` (numeric, not null)
      - `original_price` (numeric)
      - `image` (text)
      - `rating` (numeric, default 0)
      - `badge` (text)
      - `badge_color` (text)
      - `sizes` (text[], default '{}')
      - `colors` (text[], default '{}')
      - `category_id` (uuid, foreign key to `categories.id`, not null)
      - `in_stock` (boolean, default true)
      - `discount` (numeric, default 0)
      - `stock` (integer, default 0)
      - `created_at` (timestamp, default now())
  2. Security
    - Enable RLS on `products` table
    - Add policy for all users to read products
    - Add policy for authenticated users (admins) to insert, update, delete products
  3. Initial Data
    - Inserts sample product data.
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  original_price numeric,
  image text,
  rating numeric DEFAULT 0,
  badge text,
  badge_color text,
  sizes text[] DEFAULT '{}',
  colors text[] DEFAULT '{}',
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  in_stock boolean DEFAULT true,
  discount numeric DEFAULT 0,
  stock integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to products"
  ON products
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage products"
  ON products
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM user_profiles WHERE role = 'admin')) WITH CHECK (auth.uid() IN (SELECT id FROM user_profiles WHERE role = 'admin'));

-- Insert sample products
DO $$
DECLARE
  roupas_id uuid;
  acessorios_id uuid;
  calcados_id uuid;
BEGIN
  SELECT id INTO roupas_id FROM categories WHERE name = 'Roupas';
  SELECT id INTO acessorios_id FROM categories WHERE name = 'Acessórios';
  SELECT id INTO calcados_id FROM categories WHERE name = 'Calçados';

  INSERT INTO products (name, description, price, original_price, image, rating, badge, badge_color, sizes, colors, category_id, in_stock, discount, stock)
  VALUES
    ('Conjunto Body e Calça Algodão', 'Conjunto de body e calça em algodão orgânico, super macio e confortável para o bebê.', 79.90, 99.90, 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 4.8, 'Novo', 'green', ARRAY['RN', 'P', 'M', 'G'], ARRAY['Branco', 'Azul', 'Rosa'], roupas_id, true, 0, 50),
    ('Vestido Floral Verão', 'Vestido leve e fresco com estampa floral, perfeito para os dias quentes de verão.', 119.90, 149.90, 'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 4.7, 'Promoção', 'red', ARRAY['P', 'M', 'G'], ARRAY['Amarelo', 'Verde'], roupas_id, true, 10, 30),
    ('Macacão Bichinhos Divertidos', 'Macacão divertido com estampa de bichinhos, ideal para brincar e dormir.', 89.90, 109.90, 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 4.5, 'Mais Vendido', 'blue', ARRAY['RN', 'P', 'M'], ARRAY['Cinza', 'Bege'], roupas_id, true, 0, 40),
    ('Sapatinho de Tricô', 'Sapatinho de tricô feito à mão, super quentinho e delicado para os pezinhos.', 49.90, 59.90, 'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 4.9, 'Exclusivo', 'purple', ARRAY['Único'], ARRAY['Rosa', 'Azul'], calcados_id, true, 0, 25),
    ('Kit Faixas de Cabelo', 'Kit com 3 faixas de cabelo em cores variadas, para deixar sua pequena ainda mais charmosa.', 34.90, 45.00, 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 4.6, 'Novo', 'green', ARRAY['Único'], ARRAY['Rosa', 'Branco', 'Amarelo'], acessorios_id, true, 0, 60),
    ('Body Manga Longa Estampado', 'Body de manga longa com estampa fofa, ideal para os dias mais frescos.', 65.00, 75.00, 'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 4.7, 'Promoção', 'red', ARRAY['P', 'M', 'G'], ARRAY['Verde', 'Laranja'], roupas_id, true, 15, 35),
    ('Sandália Infantil Conforto', 'Sandália super confortável para os primeiros passos, com solado antiderrapante.', 95.00, 110.00, 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 4.8, 'Mais Vendido', 'blue', ARRAY['18', '20', '22'], ARRAY['Bege', 'Marinho'], calcados_id, true, 0, 45),
    ('Boné Infantil Proteção UV', 'Boné com proteção UV, perfeito para proteger os pequenos do sol com estilo.', 39.90, 50.00, 'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 4.5, 'Novo', 'green', ARRAY['Único'], ARRAY['Azul', 'Rosa', 'Cinza'], acessorios_id, true, 0, 55);
END $$;
