-- CRITICAL: Fix the users table to work properly with Supabase Auth
-- This script will restructure the users table to follow Supabase best practices

-- Step 1: Drop the existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Step 2: Create a backup of existing users data (if any)
CREATE TABLE IF NOT EXISTS public.users_backup AS SELECT * FROM public.users;

-- Step 3: Drop all foreign key constraints that reference users table
ALTER TABLE public.websites DROP CONSTRAINT IF EXISTS websites_user_id_fkey;
ALTER TABLE public.user_addresses DROP CONSTRAINT IF EXISTS user_addresses_user_id_fkey;
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;
ALTER TABLE public.support_tickets DROP CONSTRAINT IF EXISTS support_tickets_user_id_fkey;
ALTER TABLE public.transactions DROP CONSTRAINT IF EXISTS transactions_user_id_fkey;
ALTER TABLE public.payment_methods DROP CONSTRAINT IF EXISTS payment_methods_user_id_fkey;
ALTER TABLE public.activity_logs DROP CONSTRAINT IF EXISTS activity_logs_user_id_fkey;
ALTER TABLE public.feature_requests DROP CONSTRAINT IF EXISTS feature_requests_user_id_fkey;
ALTER TABLE public.email_logs DROP CONSTRAINT IF EXISTS email_logs_user_id_fkey;
ALTER TABLE public.admin_notes DROP CONSTRAINT IF EXISTS admin_notes_admin_id_fkey;
ALTER TABLE public.admin_notes DROP CONSTRAINT IF EXISTS admin_notes_user_id_fkey;

-- Step 4: Add missing user_id column to edit_requests if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'edit_requests' 
                   AND column_name = 'user_id') THEN
        ALTER TABLE public.edit_requests ADD COLUMN user_id UUID;
    END IF;
END $$;

-- Step 5: Add missing columns to contact_messages if needed
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'contact_messages' 
                   AND column_name = 'company_name') THEN
        ALTER TABLE public.contact_messages ADD COLUMN company_name VARCHAR(255);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'contact_messages' 
                   AND column_name = 'phone_number') THEN
        ALTER TABLE public.contact_messages ADD COLUMN phone_number VARCHAR(20);
    END IF;
END $$;

-- Step 6: Drop the problematic users table
DROP TABLE IF EXISTS public.users CASCADE;

-- Step 7: Recreate the users table with correct structure
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, -- Link to Supabase auth.users
    role_id INTEGER REFERENCES public.roles(id),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    gender VARCHAR(20),
    birthday DATE,
    phone_number VARCHAR(20),
    company_name VARCHAR(255),
    profile_image TEXT,
    status VARCHAR(20) DEFAULT 'active',
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Step 8: Enable RLS on the users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Step 9: Create RLS policies
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "System can insert user profiles"
  ON public.users FOR INSERT
  WITH CHECK (true);

-- Step 10: Ensure roles table has required data
INSERT INTO public.roles (name) VALUES ('admin'), ('user') ON CONFLICT (name) DO NOTHING;

-- Step 11: Create the corrected trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role_id INTEGER;
BEGIN
  -- Get the user role ID
  SELECT id INTO user_role_id FROM public.roles WHERE name = 'user' LIMIT 1;
  
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
    RAISE LOG 'Error in handle_new_user trigger: %', SQLERRM;
    RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 12: Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 13: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT ALL ON public.users TO supabase_auth_admin;
GRANT ALL ON public.roles TO supabase_auth_admin;

-- Step 14: Recreate foreign key constraints for tables that have user_id columns
-- Only add constraints for columns that actually exist

-- Websites table
ALTER TABLE public.websites ADD CONSTRAINT websites_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- User addresses table
ALTER TABLE public.user_addresses ADD CONSTRAINT user_addresses_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Edit requests table (now has user_id column)
ALTER TABLE public.edit_requests ADD CONSTRAINT edit_requests_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Notifications table
ALTER TABLE public.notifications ADD CONSTRAINT notifications_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Support tickets table
ALTER TABLE public.support_tickets ADD CONSTRAINT support_tickets_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Transactions table
ALTER TABLE public.transactions ADD CONSTRAINT transactions_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Payment methods table
ALTER TABLE public.payment_methods ADD CONSTRAINT payment_methods_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Activity logs table
ALTER TABLE public.activity_logs ADD CONSTRAINT activity_logs_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Feature requests table
ALTER TABLE public.feature_requests ADD CONSTRAINT feature_requests_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Email logs table
ALTER TABLE public.email_logs ADD CONSTRAINT email_logs_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Admin notes table (both admin_id and user_id reference users)
ALTER TABLE public.admin_notes ADD CONSTRAINT admin_notes_admin_id_fkey 
  FOREIGN KEY (admin_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE public.admin_notes ADD CONSTRAINT admin_notes_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Step 15: Update websites table column name if needed
-- Your schema shows 'preview_url' but the original schema had 'preview_image_url'
-- Let's add the preview_image_url column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'websites' 
                   AND column_name = 'preview_image_url') THEN
        ALTER TABLE public.websites ADD COLUMN preview_image_url TEXT;
    END IF;
END $$;
