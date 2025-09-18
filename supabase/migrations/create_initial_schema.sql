/*
      # Criação do Esquema Inicial do E-commerce

      1. Novas Tabelas
        - `user_profiles`
          - `id` (uuid, primary key, referência a auth.users)
          - `name` (text, nome de exibição do usuário)
          - `role` (text, 'user' ou 'admin', padrão 'user')
          - `created_at` (timestamptz, padrão now())
        - `site_settings`
          - `id` (uuid, primary key)
          - `site_name` (text)
          - `logo_url` (text)
          - `hero_title` (text)
          - `hero_subtitle` (text)
          - `about_text` (text)
          - `contact_email` (text)
          - `social_links` (jsonb)
          - `newsletter_text` (text)
          - `footer_text` (text)
          - `updated_at` (timestamptz, padrão now())
        - `categories`
          - `id` (uuid, primary key)
          - `name` (text, nome da categoria, único)
          - `slug` (text, slug amigável para URL, único)
          - `image_url` (text, URL da imagem da categoria)
          - `created_at` (timestamptz, padrão now())
        - `products`
          - `id` (uuid, primary key)
          - `name` (text, nome do produto)
          - `slug` (text, slug amigável para URL, único)
          - `description` (text)
          - `price` (numeric)
          - `image_urls` (text[], URLs das imagens do produto)
          - `category_id` (uuid, foreign key para categories.id)
          - `stock` (integer, quantidade em estoque)
          - `created_at` (timestamptz, padrão now())
          - `updated_at` (timestamptz, padrão now())
        - `orders`
          - `id` (uuid, primary key)
          - `user_id` (uuid, foreign key para auth.users.id)
          - `total_amount` (numeric)
          - `status` (text, 'pending', 'completed', 'cancelled', padrão 'pending')
          - `shipping_address` (jsonb)
          - `created_at` (timestamptz, padrão now())
          - `updated_at` (timestamptz, padrão now())
        - `order_items`
          - `id` (uuid, primary key)
          - `order_id` (uuid, foreign key para orders.id)
          - `product_id` (uuid, foreign key para products.id)
          - `quantity` (integer)
          - `price_at_purchase` (numeric)
          - `size` (text, tamanho do item)
          - `created_at` (timestamptz, padrão now())

      2. Funções e Triggers
        - `handle_new_user()`: Função que cria um perfil de usuário na tabela `user_profiles` quando um novo usuário é registrado no `auth.users`.
        - Trigger `on_auth_user_created`: Executa `handle_new_user()` após a inserção em `auth.users`.

      3. Segurança (RLS - Row Level Security)
        - Habilitar RLS para todas as novas tabelas.
        - `user_profiles`:
          - `SELECT`: Usuários autenticados podem ler seu próprio perfil.
          - `INSERT`: Permitido para a função `handle_new_user`.
          - `UPDATE`: Usuários autenticados podem atualizar seu próprio perfil.
        - `site_settings`:
          - `SELECT`: Todos podem ler as configurações do site.
          - `UPDATE`: Apenas administradores podem atualizar as configurações.
        - `categories`:
          - `SELECT`: Todos podem ler as categorias.
        - `products`:
          - `SELECT`: Todos podem ler os produtos.
        - `orders`:
          - `SELECT`: Usuários autenticados podem ler seus próprios pedidos.
          - `INSERT`: Usuários autenticados podem criar pedidos.
        - `order_items`:
          - `SELECT`: Usuários autenticados podem ler os itens de seus próprios pedidos.
          - `INSERT`: Usuários autenticados podem criar itens de pedido.

      4. Notas Importantes
        - As tabelas `categories` e `products` são populadas com dados de exemplo para iniciar.
        - A tabela `site_settings` é inicializada com configurações padrão.
        - `auth.uid()` é usado para referenciar o ID do usuário logado.
        - `auth.role()` pode ser usado para verificar o papel do usuário, mas aqui usamos a coluna `role` em `user_profiles`.
    */

    -- Tabela user_profiles
    CREATE TABLE IF NOT EXISTS user_profiles (
      id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      name text DEFAULT '' NOT NULL,
      role text DEFAULT 'user' NOT NULL, -- 'user' ou 'admin'
      created_at timestamptz DEFAULT now()
    );

    ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Authenticated users can view their own profile."
      ON user_profiles FOR SELECT
      TO authenticated
      USING (auth.uid() = id);

    CREATE POLICY "Authenticated users can update their own profile."
      ON user_profiles FOR UPDATE
      TO authenticated
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);

    -- Tabela site_settings
    CREATE TABLE IF NOT EXISTS site_settings (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      site_name text DEFAULT 'Lavibaby' NOT NULL,
      logo_url text DEFAULT 'https://images.pexels.com/photos/160846/baby-car-seat-safety-travel-160846.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' NOT NULL,
      hero_title text DEFAULT 'Bem-vindo à Lavibaby' NOT NULL,
      hero_subtitle text DEFAULT 'Tudo para o seu bebê com amor e cuidado.' NOT NULL,
      about_text text DEFAULT 'Na Lavibaby, acreditamos que cada bebê merece o melhor. Oferecemos produtos de alta qualidade, seguros e confortáveis para acompanhar cada fase do crescimento do seu pequeno. Nossa missão é facilitar a vida dos pais, proporcionando uma experiência de compra tranquila e confiável.' NOT NULL,
      contact_email text DEFAULT 'contato@lavibaby.com' NOT NULL,
      social_links jsonb DEFAULT '{"facebook": "https://facebook.com/lavibaby", "instagram": "https://instagram.com/lavibaby"}'::jsonb NOT NULL,
      newsletter_text text DEFAULT 'Receba as últimas novidades e ofertas exclusivas!' NOT NULL,
      footer_text text DEFAULT '© 2023 Lavibaby. Todos os direitos reservados.' NOT NULL,
      updated_at timestamptz DEFAULT now()
    );

    ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Anyone can read site settings."
      ON site_settings FOR SELECT
      TO public
      USING (true);

    CREATE POLICY "Admins can update site settings."
      ON site_settings FOR UPDATE
      TO authenticated
      USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'))
      WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'));

    -- Inserir configurações padrão se a tabela estiver vazia
    INSERT INTO site_settings (site_name, logo_url, hero_title, hero_subtitle, about_text, contact_email, social_links, newsletter_text, footer_text)
    SELECT
      'Lavibaby',
      'https://images.pexels.com/photos/160846/baby-car-seat-safety-travel-160846.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'Bem-vindo à Lavibaby',
      'Tudo para o seu bebê com amor e cuidado.',
      'Na Lavibaby, acreditamos que cada bebê merece o melhor. Oferecemos produtos de alta qualidade, seguros e confortáveis para acompanhar cada fase do crescimento do seu pequeno. Nossa missão é facilitar a vida dos pais, proporcionando uma experiência de compra tranquila e confiável.',
      'contato@lavibaby.com',
      '{"facebook": "https://facebook.com/lavibaby", "instagram": "https://instagram.com/lavibaby"}',
      'Receba as últimas novidades e ofertas exclusivas!',
      '© 2023 Lavibaby. Todos os direitos reservados.'
    WHERE NOT EXISTS (SELECT 1 FROM site_settings);

    -- Tabela categories
    CREATE TABLE IF NOT EXISTS categories (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text UNIQUE NOT NULL,
      slug text UNIQUE NOT NULL,
      image_url text DEFAULT 'https://images.pexels.com/photos/160846/baby-car-seat-safety-travel-160846.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' NOT NULL,
      created_at timestamptz DEFAULT now()
    );

    ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Anyone can read categories."
      ON categories FOR SELECT
      TO public
      USING (true);

    -- Inserir categorias de exemplo
    INSERT INTO categories (name, slug, image_url) VALUES
    ('Roupas de Bebê', 'roupas-de-bebe', 'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'),
    ('Brinquedos', 'brinquedos', 'https://images.pexels.com/photos/207891/pexels-photo-207891.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'),
    ('Carrinhos e Cadeirinhas', 'carrinhos-cadeirinhas', 'https://images.pexels.com/photos/160846/baby-car-seat-safety-travel-160846.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'),
    ('Alimentação', 'alimentacao', 'https://images.pexels.com/photos/139303/pexels-photo-139303.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'),
    ('Higiene e Cuidados', 'higiene-cuidados', 'https://images.pexels.com/photos/3997986/pexels-photo-3997986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')
    ON CONFLICT (name) DO NOTHING;

    -- Tabela products
    CREATE TABLE IF NOT EXISTS products (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      slug text UNIQUE NOT NULL,
      description text DEFAULT '' NOT NULL,
      price numeric DEFAULT 0.00 NOT NULL,
      image_urls text[] DEFAULT '{}'::text[] NOT NULL,
      category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
      stock integer DEFAULT 0 NOT NULL,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );

    ALTER TABLE products ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Anyone can read products."
      ON products FOR SELECT
      TO public
      USING (true);

    -- Inserir produtos de exemplo
    INSERT INTO products (name, slug, description, price, image_urls, category_id, stock) VALUES
    ('Body de Algodão Orgânico', 'body-algodao-organico', 'Body macio e confortável para bebês, feito de algodão orgânico.', 49.90, ARRAY['https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], (SELECT id FROM categories WHERE slug = 'roupas-de-bebe'), 100),
    ('Chocalho de Madeira', 'chocalho-madeira', 'Chocalho ecológico de madeira, seguro para o bebê.', 29.50, ARRAY['https://images.pexels.com/photos/207891/pexels-photo-207891.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], (SELECT id FROM categories WHERE slug = 'brinquedos'), 50),
    ('Carrinho de Bebê Compacto', 'carrinho-bebe-compacto', 'Carrinho leve e dobrável, ideal para passeios.', 899.00, ARRAY['https://images.pexels.com/photos/160846/baby-car-seat-safety-travel-160846.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], (SELECT id FROM categories WHERE slug = 'carrinhos-cadeirinhas'), 20),
    ('Mamadeira Anti-Cólica', 'mamadeira-anti-colica', 'Mamadeira com sistema anti-cólica para maior conforto do bebê.', 35.00, ARRAY['https://images.pexels.com/photos/139303/pexels-photo-139303.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], (SELECT id FROM categories WHERE slug = 'alimentacao'), 75),
    ('Kit de Higiene para Bebê', 'kit-higiene-bebe', 'Conjunto completo para os cuidados diários do bebê.', 120.00, ARRAY['https://images.pexels.com/photos/3997986/pexels-photo-3997986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'], (SELECT id FROM categories WHERE slug = 'higiene-cuidados'), 40)
    ON CONFLICT (slug) DO NOTHING;

    -- Tabela orders
    CREATE TABLE IF NOT EXISTS orders (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
      total_amount numeric DEFAULT 0.00 NOT NULL,
      status text DEFAULT 'pending' NOT NULL, -- 'pending', 'completed', 'cancelled'
      shipping_address jsonb DEFAULT '{}'::jsonb NOT NULL,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );

    ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Authenticated users can create orders."
      ON orders FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Authenticated users can view their own orders."
      ON orders FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);

    -- Tabela order_items
    CREATE TABLE IF NOT EXISTS order_items (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
      product_id uuid REFERENCES products(id) ON DELETE SET NULL,
      quantity integer DEFAULT 1 NOT NULL,
      price_at_purchase numeric DEFAULT 0.00 NOT NULL,
      size text DEFAULT '' NOT NULL,
      created_at timestamptz DEFAULT now()
    );

    ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Authenticated users can create order items for their orders."
      ON order_items FOR INSERT
      TO authenticated
      WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_id AND orders.user_id = auth.uid()));

    CREATE POLICY "Authenticated users can view their order items."
      ON order_items FOR SELECT
      TO authenticated
      USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_id AND orders.user_id = auth.uid()));

    -- Função para criar perfil de usuário automaticamente
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO public.user_profiles (id, name, role)
      VALUES (NEW.id, NEW.raw_user_meta_data->>'name', 'user');
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Trigger para executar a função handle_new_user
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

    -- Configurar permissões para a função (importante para RLS)
    ALTER FUNCTION public.handle_new_user() OWNER TO postgres;
    GRANT EXECUTE ON FUNCTION public.handle_new_user() TO supabase_admin;
    GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
    GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon;