-- ===========================================
-- COMPLETE SITE IGUANA DATABASE SCHEMA
-- ===========================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- ROLES TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default roles
INSERT INTO roles (name, description) VALUES 
('user', 'Regular customer who can request websites'),
('admin', 'Administrator who manages website requests and approvals')
ON CONFLICT (name) DO NOTHING;

-- ===========================================
-- USERS TABLE (extends Supabase auth.users)
-- ===========================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES roles(id) DEFAULT 1, -- Default to 'user' role
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    company_name VARCHAR(255),
    phone_number VARCHAR(20),
    profile_image_url TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Function to automatically create user profile when auth.users entry is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role_id INTEGER;
BEGIN
  -- Get the 'user' role ID
  SELECT id INTO user_role_id FROM roles WHERE name = 'user';
  
  -- Insert into public.users
  INSERT INTO public.users (id, role_id, first_name, last_name)
  VALUES (
    NEW.id,
    user_role_id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
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
-- WEBSITE PLANS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS website_plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    setup_fee DECIMAL(10,2) NOT NULL, -- One-time setup fee
    monthly_price DECIMAL(10,2) NOT NULL, -- Monthly subscription price
    max_pages INTEGER DEFAULT 1,
    max_changes_per_month INTEGER DEFAULT 5,
    features JSONB, -- Store plan features as JSON
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default plans
INSERT INTO website_plans (name, description, setup_fee, monthly_price, max_pages, max_changes_per_month, features) VALUES
('Basic Plan', 'Perfect for simple business websites', 297.00, 97.00, 5, 5, '["Mobile Responsive", "Basic SEO", "Contact Form", "Google Analytics"]'),
('Standard Plan', 'Great for growing businesses', 497.00, 197.00, 10, 10, '["Mobile Responsive", "Advanced SEO", "E-commerce Ready", "Social Media Integration", "Blog Setup"]'),
('Premium Plan', 'For businesses that need everything', 797.00, 397.00, 999, 999, '["Mobile Responsive", "Advanced SEO", "Full E-commerce", "Custom Functionality", "Priority Support", "Unlimited Changes"]')
ON CONFLICT DO NOTHING;

-- ===========================================
-- WEBSITE REQUESTS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS website_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_id INTEGER REFERENCES website_plans(id),
    
    -- Request Details
    business_name VARCHAR(255) NOT NULL,
    business_description TEXT,
    website_purpose TEXT, -- What the website is for
    target_audience TEXT, -- Who the website is for
    preferred_colors VARCHAR(255), -- Color preferences
    reference_websites TEXT, -- URLs of websites they like
    special_requirements TEXT, -- Any special needs
    
    -- Request Status Flow
    status VARCHAR(50) DEFAULT 'pending_approval' CHECK (status IN (
        'pending_approval',    -- Waiting for admin approval
        'approved',           -- Admin approved, waiting for payment
        'payment_completed',  -- Payment done, ready to start building
        'in_progress',        -- Currently being built
        'completed',          -- Site is finished
        'live',              -- Site is live and billing started
        'rejected',          -- Admin rejected the request
        'cancelled'          -- User cancelled
    )),
    
    -- Admin fields
    admin_notes TEXT, -- Internal admin notes
    approved_by UUID REFERENCES users(id), -- Which admin approved
    approved_at TIMESTAMP WITH TIME ZONE,
    rejected_reason TEXT, -- Why it was rejected
    
    -- Payment tracking
    setup_fee_paid BOOLEAN DEFAULT FALSE,
    setup_payment_date TIMESTAMP WITH TIME ZONE,
    stripe_setup_payment_intent_id TEXT, -- Stripe payment intent ID
    
    -- Website delivery
    staging_url TEXT, -- URL where client can preview
    live_url TEXT, -- Final website URL
    domain_name VARCHAR(255), -- Custom domain if provided
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- WEBSITE SUBSCRIPTIONS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS website_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    website_request_id UUID REFERENCES website_requests(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_id INTEGER REFERENCES website_plans(id),
    
    -- Subscription details
    stripe_subscription_id TEXT UNIQUE, -- Stripe subscription ID
    stripe_customer_id TEXT, -- Stripe customer ID
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN (
        'active',
        'past_due',
        'cancelled',
        'unpaid'
    )),
    
    -- Billing
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    monthly_amount DECIMAL(10,2),
    
    -- Usage tracking
    changes_used_this_month INTEGER DEFAULT 0,
    changes_reset_date TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- USER REMARKS/COMMENTS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS website_remarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    website_request_id UUID REFERENCES website_requests(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Remark content
    message TEXT NOT NULL,
    remark_type VARCHAR(50) DEFAULT 'general' CHECK (remark_type IN (
        'general',      -- General comment
        'change_request', -- Requesting a change
        'feedback',     -- Feedback on current progress
        'question'      -- Question for the team
    )),
    
    -- Admin response
    admin_response TEXT,
    responded_by UUID REFERENCES users(id),
    responded_at TIMESTAMP WITH TIME ZONE,
    
    -- Status
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN (
        'open',         -- Waiting for admin response
        'in_progress',  -- Admin is working on it
        'completed',    -- Change/request completed
        'closed'        -- Closed without action
    )),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- SYSTEM NOTIFICATIONS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification content
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info' CHECK (type IN (
        'info',         -- General information
        'success',      -- Success message
        'warning',      -- Warning message
        'error',        -- Error message
        'payment',      -- Payment related
        'status_update' -- Project status update
    )),
    
    -- Related entities
    website_request_id UUID REFERENCES website_requests(id),
    remark_id UUID REFERENCES website_remarks(id),
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- PAYMENT TRANSACTIONS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    website_request_id UUID REFERENCES website_requests(id),
    subscription_id UUID REFERENCES website_subscriptions(id),
    
    -- Transaction details
    transaction_type VARCHAR(50) CHECK (transaction_type IN (
        'setup_fee',        -- One-time setup payment
        'monthly_subscription', -- Monthly recurring payment
        'refund'           -- Refund transaction
    )),
    
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Stripe details
    stripe_payment_intent_id TEXT,
    stripe_charge_id TEXT,
    stripe_invoice_id TEXT,
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN (
        'pending',
        'succeeded',
        'failed',
        'cancelled',
        'refunded'
    )),
    
    -- Metadata
    description TEXT,
    failure_reason TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- ADMIN ACTIVITY LOG TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS admin_activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Activity details
    action VARCHAR(100) NOT NULL, -- 'approved_request', 'rejected_request', 'updated_status', etc.
    entity_type VARCHAR(50), -- 'website_request', 'remark', 'user', etc.
    entity_id UUID, -- ID of the entity being acted upon
    
    -- Details
    description TEXT,
    old_values JSONB, -- Previous values (for updates)
    new_values JSONB, -- New values (for updates)
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- ROW LEVEL SECURITY POLICIES
-- ===========================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_remarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Website requests policies
CREATE POLICY "Users can view own website requests" ON website_requests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create website requests" ON website_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own website requests" ON website_requests
    FOR UPDATE USING (auth.uid() = user_id);

-- Admins can see all website requests
CREATE POLICY "Admins can view all website requests" ON website_requests
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u 
            JOIN roles r ON u.role_id = r.id 
            WHERE u.id = auth.uid() AND r.name = 'admin'
        )
    );

-- Website subscriptions policies
CREATE POLICY "Users can view own subscriptions" ON website_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Website remarks policies
CREATE POLICY "Users can view remarks for their requests" ON website_remarks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM website_requests wr 
            WHERE wr.id = website_request_id AND wr.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create remarks for their requests" ON website_remarks
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM website_requests wr 
            WHERE wr.id = website_request_id AND wr.user_id = auth.uid()
        )
    );

-- Admins can see all remarks
CREATE POLICY "Admins can manage all remarks" ON website_remarks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u 
            JOIN roles r ON u.role_id = r.id 
            WHERE u.id = auth.uid() AND r.name = 'admin'
        )
    );

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Payment transactions policies
CREATE POLICY "Users can view own transactions" ON payment_transactions
    FOR SELECT USING (auth.uid() = user_id);

-- ===========================================
-- FUNCTIONS FOR AUTOMATIC UPDATES
-- ===========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_website_requests_updated_at BEFORE UPDATE ON website_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_website_subscriptions_updated_at BEFORE UPDATE ON website_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- FUNCTIONS FOR NOTIFICATIONS
-- ===========================================

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id UUID,
    p_title VARCHAR(255),
    p_message TEXT,
    p_type VARCHAR(50) DEFAULT 'info',
    p_website_request_id UUID DEFAULT NULL,
    p_remark_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO notifications (user_id, title, message, type, website_request_id, remark_id)
    VALUES (p_user_id, p_title, p_message, p_type, p_website_request_id, p_remark_id)
    RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to notify user when request status changes
CREATE OR REPLACE FUNCTION notify_request_status_change()
RETURNS TRIGGER AS $$
DECLARE
    notification_title TEXT;
    notification_message TEXT;
BEGIN
    -- Only create notification if status actually changed
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        CASE NEW.status
            WHEN 'approved' THEN
                notification_title := 'Website Request Approved!';
                notification_message := 'Great news! Your website request for "' || NEW.business_name || '" has been approved. Please proceed with payment to start the development process.';
            WHEN 'rejected' THEN
                notification_title := 'Website Request Update';
                notification_message := 'Your website request for "' || NEW.business_name || '" needs some adjustments. Please check the admin notes for details.';
            WHEN 'in_progress' THEN
                notification_title := 'Website Development Started';
                notification_message := 'Exciting! We''ve started building your website for "' || NEW.business_name || '". You can track progress and leave remarks in your dashboard.';
            WHEN 'completed' THEN
                notification_title := 'Website Completed!';
                notification_message := 'Your website for "' || NEW.business_name || '" is now complete! Please review it and let us know if you need any final adjustments.';
            WHEN 'live' THEN
                notification_title := 'Website is Live!';
                notification_message := 'Congratulations! Your website for "' || NEW.business_name || '" is now live. Monthly billing has started for ongoing maintenance and support.';
            ELSE
                RETURN NEW; -- Don't create notification for other status changes
        END CASE;
        
        PERFORM create_notification(
            NEW.user_id,
            notification_title,
            notification_message,
            'status_update',
            NEW.id,
            NULL
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for request status changes
CREATE TRIGGER notify_on_request_status_change
    AFTER UPDATE ON website_requests
    FOR EACH ROW
    EXECUTE FUNCTION notify_request_status_change();

-- ===========================================
-- INDEXES FOR PERFORMANCE
-- ===========================================

-- Indexes on frequently queried columns
CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_website_requests_user_id ON website_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_website_requests_status ON website_requests(status);
CREATE INDEX IF NOT EXISTS idx_website_subscriptions_user_id ON website_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_website_subscriptions_status ON website_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_website_remarks_request_id ON website_remarks(website_request_id);
CREATE INDEX IF NOT EXISTS idx_website_remarks_user_id ON website_remarks(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);

-- ===========================================
-- SAMPLE DATA FOR TESTING (OPTIONAL)
-- ===========================================

-- This section can be uncommented for testing purposes
/*
-- Create a sample admin user (you'll need to register this user through Supabase Auth first)
-- UPDATE users SET role_id = (SELECT id FROM roles WHERE name = 'admin') 
-- WHERE id = 'YOUR_ADMIN_USER_UUID_HERE';

-- Sample website request
-- INSERT INTO website_requests (user_id, plan_id, business_name, business_description, website_purpose)
-- VALUES (
--     'YOUR_USER_UUID_HERE',
--     1,
--     'Sample Business',
--     'A sample business for testing',
--     'To showcase our services online'
-- );
*/
