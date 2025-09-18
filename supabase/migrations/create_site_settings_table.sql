/*
  # Create site_settings table

  1. New Tables
    - `site_settings`
      - `id` (uuid, primary key, default gen_random_uuid())
      - `company_name` (text, default 'LaviBaby')
      - `phone` (text, default '(11) 99999-9999')
      - `email` (text, default 'contato@lavibaby.com.br')
      - `address` (text, default 'São Paulo, SP - Brasil')
      - `instagram` (text, default '@lavibaby')
      - `facebook` (text, default 'LaviBaby')
      - `twitter` (text, default '@lavibaby')
      - `whatsapp` (text, default '5511999999999')
      - `working_hours` (text, default 'Seg-Sex: 8h às 18h')
      - `hero_title` (text, default 'Roupas que fazem os pequenos brilharem')
      - `hero_subtitle` (text, default 'Descubra nossa coleção exclusiva de roupas infantis. Conforto, estilo e qualidade para os momentos especiais dos seus pequenos.')
      - `about_title` (text, default 'Por que escolher a LaviBaby?')
      - `about_description` (text, default 'Somos uma loja especializada em roupas infantis que combina estilo, conforto e qualidade. Nossa missão é fazer com que cada criança se sinta especial e confiante.')
      - `free_shipping_min_value` (numeric, default 150)
      - `discount_percentage` (numeric, default 20)
      - `logo_url` (text, default '/LOGO HORIZONTAL TRANSPARENTE.png')
      - `button_links` (jsonb, default '{}')
      - `updated_at` (timestamp, default now())
  2. Security
    - Enable RLS on `site_settings` table
    - Add policy for all users to read site settings
    - Add policy for authenticated users (admins) to update site settings
  3. Initial Data
    - Inserts default site settings.
*/

CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text DEFAULT 'LaviBaby',
  phone text DEFAULT '(11) 99999-9999',
  email text DEFAULT 'contato@lavibaby.com.br',
  address text DEFAULT 'São Paulo, SP - Brasil',
  instagram text DEFAULT '@lavibaby',
  facebook text DEFAULT 'LaviBaby',
  twitter text DEFAULT '@lavibaby',
  whatsapp text DEFAULT '5511999999999',
  working_hours text DEFAULT 'Seg-Sex: 8h às 18h',
  hero_title text DEFAULT 'Roupas que fazem os pequenos brilharem',
  hero_subtitle text DEFAULT 'Descubra nossa coleção exclusiva de roupas infantis. Conforto, estilo e qualidade para os momentos especiais dos seus pequenos.',
  about_title text DEFAULT 'Por que escolher a LaviBaby?',
  about_description text DEFAULT 'Somos uma loja especializada em roupas infantis que combina estilo, conforto e qualidade. Nossa missão é fazer com que cada criança se sinta especial e confiante.',
  free_shipping_min_value numeric DEFAULT 150,
  discount_percentage numeric DEFAULT 20,
  logo_url text DEFAULT '/LOGO HORIZONTAL TRANSPARENTE.png',
  button_links jsonb DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to site settings"
  ON site_settings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to update site settings"
  ON site_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM user_profiles WHERE role = 'admin')) WITH CHECK (auth.uid() IN (SELECT id FROM user_profiles WHERE role = 'admin'));

INSERT INTO site_settings (company_name, phone, email, address, instagram, facebook, twitter, whatsapp, working_hours, hero_title, hero_subtitle, about_title, about_description, free_shipping_min_value, discount_percentage, logo_url, button_links)
VALUES (
  'LaviBaby',
  '(11) 99999-9999',
  'contato@lavibaby.com.br',
  'São Paulo, SP - Brasil',
  '@lavibaby',
  'LaviBaby',
  '@lavibaby',
  '5511999999999',
  'Seg-Sex: 8h às 18h',
  'Roupas que fazem os pequenos brilharem',
  'Descubra nossa coleção exclusiva de roupas infantis. Conforto, estilo e qualidade para os momentos especiais dos seus pequenos.',
  'Por que escolher a LaviBaby?',
  'Somos uma loja especializada em roupas infantis que combina estilo, conforto e qualidade. Nossa missão é fazer com que cada criança se sinta especial e confiante.',
  150,
  20,
  '/LOGO HORIZONTAL TRANSPARENTE.png',
  '{
    "verColecao": "#categorias",
    "ofertas": "#produtos",
    "verOfertas": "#produtos",
    "comprarAgora": "#produtos",
    "queroDesconto": "#newsletter",
    "falarWhatsApp": "https://wa.me/5511999999999",
    "verTodosProdutos": "#produtos",
    "baixarApp": "#",
    "criarConta": "#"
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING; -- Assuming there will only be one row, or handle updates if multiple are possible
