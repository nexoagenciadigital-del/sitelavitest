/*
  # Update handle_new_user function

  1. Functions
    - `handle_new_user`: Corrected to insert `name` from `raw_user_meta_data` or `email` into `user_profiles`, removing the incorrect `email` column insertion.
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
