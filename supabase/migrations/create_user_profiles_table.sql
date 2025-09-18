/*
  # Create user_profiles table

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references `auth.users.id`)
      - `name` (text, not null)
      - `role` (text, default 'user', check ('user' or 'admin'))
      - `cpf` (text, unique)
      - `telefone` (text)
      - `address` (jsonb)
      - `aceita_newsletter` (boolean, default false)
      - `created_at` (timestamp, default now())
      - `updated_at` (timestamp, default now())
  2. Security
    - Enable RLS on `user_profiles` table
    - Add policy for users to read/update their own profile
    - Add policy for authenticated users to insert their profile on sign up
    - Add policy for admins to read all profiles
  3. Functions
    - `handle_new_user`: A trigger function to create a `user_profile` entry when a new user signs up via `auth.users`.
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  cpf text UNIQUE,
  telefone text,
  address jsonb,
  aceita_newsletter boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own profile
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy for users to update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Policy for authenticated users to insert their profile (on sign up)
CREATE POLICY "Authenticated users can insert their profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policy for admins to read all profiles
CREATE POLICY "Admins can read all user profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create a function to handle new user sign-ups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, email)
  VALUES (NEW.id, NEW.email, NEW.email); -- Assuming 'name' can be initialized with email, or left null
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function on new user sign-ups
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert an initial admin user profile (replace with your actual admin user ID from auth.users if already created)
-- IMPORTANT: You will need to manually sign up an admin user via Supabase Auth, then update their role in the user_profiles table.
-- For demonstration, we'll assume an admin user will be created and their role updated manually.
-- Example: INSERT INTO user_profiles (id, name, role, email) VALUES ('<admin-user-uuid>', 'Admin User', 'admin', 'admin@lavibaby.com');
