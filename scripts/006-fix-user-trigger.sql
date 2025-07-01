-- First, ensure the 'user' role exists (without description column)
INSERT INTO public.roles (name) 
VALUES ('user')
ON CONFLICT (name) DO NOTHING;

-- Drop the existing trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create a more robust function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role_id INTEGER;
BEGIN
  -- Get the user role ID (roles.id is INTEGER, not UUID)
  SELECT id INTO user_role_id FROM public.roles WHERE name = 'user' LIMIT 1;
  
  -- If no user role found, create it
  IF user_role_id IS NULL THEN
    INSERT INTO public.roles (name) 
    VALUES ('user')
    RETURNING id INTO user_role_id;
  END IF;

  -- Insert the new user profile
  INSERT INTO public.users (
    id,
    role_id,
    first_name,
    last_name,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    user_role_id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NOW(),
    NOW()
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error (this will appear in Supabase logs)
    RAISE LOG 'Error in handle_new_user trigger: %', SQLERRM;
    -- Re-raise the exception to prevent user creation if profile creation fails
    RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT ALL ON public.users TO supabase_auth_admin;
GRANT ALL ON public.roles TO supabase_auth_admin;
GRANT SELECT ON public.roles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;

-- Temporarily disable RLS to allow trigger operations
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- Create policies that allow the trigger to work
DROP POLICY IF EXISTS "Allow authenticated users to read their own profile" ON public.users;
DROP POLICY IF EXISTS "Allow system to insert user profiles" ON public.users;
DROP POLICY IF EXISTS "Allow authenticated users to read roles" ON public.roles;

-- Policy for users to read their own profile
CREATE POLICY "Allow authenticated users to read their own profile"
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Policy for system/trigger to insert user profiles
CREATE POLICY "Allow system to insert user profiles"
ON public.users
FOR INSERT
WITH CHECK (true);

-- Policy for reading roles
CREATE POLICY "Allow authenticated users to read roles"
ON public.roles
FOR SELECT
TO authenticated, anon
USING (true);
