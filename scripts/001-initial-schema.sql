-- ===========================================
-- ROLES
-- ===========================================
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Insert default roles if they don't exist
INSERT INTO roles (name) VALUES ('admin'), ('user') ON CONFLICT (name) DO NOTHING;

-- ===========================================
-- USERS
-- ===========================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, -- Link to Supabase auth.users
    role_id INTEGER REFERENCES roles(id),
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

-- Function to automatically create a user profile when a new auth.users entry is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role_id INTEGER;
BEGIN
  -- Default to 'user' role
  SELECT id INTO user_role_id FROM roles WHERE name = 'user';
  INSERT INTO public.users (id, role_id, first_name, last_name)
  VALUES (
    NEW.id,
    user_role_id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ===========================================
-- USER ADDRESSES
-- ===========================================
CREATE TABLE IF NOT EXISTS user_addresses (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) CHECK (type IN ('primary', 'billing')),
    street VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    additional_info TEXT,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- ===========================================
-- PLANS
-- ===========================================
CREATE TABLE IF NOT EXISTS plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    monthly_price NUMERIC(10,2),
    setup_fee NUMERIC(10,2),
    edit_limit INTEGER DEFAULT 3,
    is_custom BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active',
    is_deleted BOOLEAN DEFAULT FALSE
);

-- ===========================================
-- WEBSITES
-- ===========================================
CREATE TABLE IF NOT EXISTS websites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_id INTEGER REFERENCES plans(id),
    title VARCHAR(255),
    description TEXT,
    preview_image_url TEXT, -- Changed from preview_url to be more specific
    live_url TEXT,
    domain_name VARCHAR(255),
    tech_stack TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- e.g., pending, design, development, live, paused
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS for websites table
ALTER TABLE websites ENABLE ROW LEVEL SECURITY;

-- Policies for websites table
CREATE POLICY "Users can view their own websites."
  ON websites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own websites."
  ON websites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own websites."
  ON websites FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own websites."
  ON websites FOR DELETE
  USING (auth.uid() = user_id);

-- ===========================================
-- EDIT REQUESTS
-- ===========================================
CREATE TABLE IF NOT EXISTS edit_requests (
    id SERIAL PRIMARY KEY,
    website_id UUID REFERENCES websites(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- Added user_id for easier querying
    request_text TEXT NOT NULL,
    attachment_url TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- e.g., pending, in_progress, completed, rejected
    admin_response TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- PAYMENT METHODS
-- ===========================================
CREATE TABLE IF NOT EXISTS payment_methods (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    cardholder_name VARCHAR(100),
    card_number_last4 VARCHAR(4), -- Store only last 4 digits
    card_brand VARCHAR(50),
    card_expiry_month VARCHAR(2),
    card_expiry_year VARCHAR(4),
    stripe_payment_method_id TEXT UNIQUE, -- Store Stripe PaymentMethod ID
    is_primary BOOLEAN DEFAULT TRUE,
    status VARCHAR(20) DEFAULT 'active',
    is_deleted BOOLEAN DEFAULT FALSE
);

-- ===========================================
-- TRANSACTIONS
-- ===========================================
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    website_id UUID REFERENCES websites(id),
    amount NUMERIC(10,2),
    description TEXT,
    status VARCHAR(20) DEFAULT 'paid', -- e.g., pending, paid, failed, refunded
    payment_method_id INTEGER REFERENCES payment_methods(id),
    stripe_charge_id TEXT UNIQUE, -- Store Stripe Charge ID
    receipt_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- NOTIFICATIONS
-- ===========================================
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    message TEXT,
    category VARCHAR(50), -- e.g., billing, website_update, announcement
    is_read BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- SUPPORT TICKETS
-- ===========================================
CREATE TABLE IF NOT EXISTS support_tickets (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(255),
    message TEXT,
    priority VARCHAR(20) DEFAULT 'medium', -- e.g., low, medium, high, urgent
    status VARCHAR(20) DEFAULT 'open', -- e.g., open, in_progress, resolved, closed
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- CONTACT MESSAGES (from website contact form)
-- ===========================================
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(255),
    company_name VARCHAR(255), -- Added from user's request
    phone_number VARCHAR(20), -- Added from user's request
    subject VARCHAR(255),
    message TEXT,
    ip_address TEXT,
    location TEXT,
    device TEXT,
    browser TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- ACTIVITY LOGS
-- ===========================================
CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    activity TEXT NOT NULL,
    url TEXT,
    ip_address TEXT,
    location TEXT,
    device TEXT,
    browser TEXT,
    os TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- FEATURE REQUESTS
-- ===========================================
CREATE TABLE IF NOT EXISTS feature_requests (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    website_id UUID REFERENCES websites(id),
    title VARCHAR(255),
    description TEXT,
    priority VARCHAR(20) DEFAULT 'normal',
    status VARCHAR(20) DEFAULT 'open', -- e.g., open, under_review, planned, in_progress, completed, rejected
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- ADMIN NOTES
-- ===========================================
CREATE TABLE IF NOT EXISTS admin_notes (
    id SERIAL PRIMARY KEY,
    admin_id UUID REFERENCES users(id) ON DELETE CASCADE, -- User who wrote the note (must be admin)
    target_user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- User the note is about
    website_id UUID REFERENCES websites(id), -- Optional: if note is about a specific website
    note TEXT,
    visibility VARCHAR(20) DEFAULT 'private', -- e.g., private (only admins), shared_with_user
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- EMAIL LOGS
-- ===========================================
CREATE TABLE IF NOT EXISTS email_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    email_to VARCHAR(255),
    subject VARCHAR(255),
    body TEXT,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'sent' -- e.g., sent, failed, bounced
);

-- ===========================================
-- SETUP STORAGE BUCKETS AND POLICIES
-- ===========================================

-- Create 'websites_assets' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('websites_assets', 'websites_assets', false) -- Set to false for private by default
ON CONFLICT (id) DO NOTHING;

-- Policies for 'websites_assets' bucket
-- Allow authenticated users to upload to their own folder within the bucket
CREATE POLICY "Authenticated users can upload website assets"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'websites_assets' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow authenticated users to view their own assets
CREATE POLICY "Authenticated users can view their own website assets"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'websites_assets' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow authenticated users to update their own assets
CREATE POLICY "Authenticated users can update their own website assets"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'websites_assets' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow authenticated users to delete their own assets
CREATE POLICY "Authenticated users can delete their own website assets"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'websites_assets' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Note: For public URLs, you'd typically make the bucket public or use signed URLs.
-- If you need public access to specific files, you might consider a separate public bucket or adjust policies.
-- For now, assets are private to the user.

-- Example: Make the bucket public (if needed for direct image linking without signed URLs)
-- UPDATE storage.buckets SET public = true WHERE id = 'websites_assets';
-- If making public, ensure RLS on your tables still protects sensitive data.
-- For more granular control, signed URLs are generally preferred for private buckets.
