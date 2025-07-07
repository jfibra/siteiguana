-- ===========================================
-- STRIPE PAYMENT METHODS & USER CREATION UPDATE
-- ===========================================

-- ===========================================
-- ADD STRIPE PAYMENT METHODS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS stripe_payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Stripe references (we never store actual card details)
    stripe_customer_id TEXT NOT NULL, -- Stripe customer ID
    stripe_payment_method_id TEXT NOT NULL, -- Stripe payment method ID
    
    -- Card information (last 4 digits and brand only - safe to store)
    card_brand VARCHAR(20), -- visa, mastercard, amex, etc.
    card_last_four VARCHAR(4), -- last 4 digits only
    card_exp_month INTEGER, -- expiration month
    card_exp_year INTEGER, -- expiration year
    
    -- Payment method status
    is_default BOOLEAN DEFAULT FALSE, -- is this the default payment method
    is_active BOOLEAN DEFAULT TRUE, -- is this payment method still valid
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_stripe_payment_methods_user_id ON stripe_payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_payment_methods_customer_id ON stripe_payment_methods(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_stripe_payment_methods_default ON stripe_payment_methods(user_id, is_default) WHERE is_default = true;

-- ===========================================
-- UPDATE EXISTING TABLES FOR STRIPE INTEGRATION
-- ===========================================

-- Add Stripe customer ID to users table if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_subscription_id VARCHAR(255);

-- Add more Stripe fields to website_subscriptions table
ALTER TABLE website_subscriptions ADD COLUMN IF NOT EXISTS stripe_price_id TEXT; -- Stripe price ID for the plan
ALTER TABLE website_subscriptions ADD COLUMN IF NOT EXISTS stripe_payment_method_id TEXT; -- Default payment method for this subscription

-- Add Stripe fields to payment_transactions table
ALTER TABLE payment_transactions ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE payment_transactions ADD COLUMN IF NOT EXISTS stripe_payment_method_id TEXT;

-- Add Stripe-related columns to website_requests table
ALTER TABLE website_requests ADD COLUMN IF NOT EXISTS stripe_setup_payment_intent_id VARCHAR(255);
ALTER TABLE website_requests ADD COLUMN IF NOT EXISTS stripe_subscription_id VARCHAR(255);

-- ===========================================
-- CREATE NEW TABLES FOR STRIPE INTEGRATION
-- ===========================================

-- Create payment_methods table to store user payment method references
CREATE TABLE IF NOT EXISTS payment_methods (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stripe_payment_method_id VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'card', -- card, bank_account, etc.
    
    -- Safe display information (never store actual card numbers)
    card_brand VARCHAR(50), -- visa, mastercard, amex, etc.
    card_last4 VARCHAR(4), -- last 4 digits only
    card_exp_month INTEGER,
    card_exp_year INTEGER,
    
    -- Status and metadata
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_stripe_id ON payment_methods(stripe_payment_method_id);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id);

-- Create subscriptions table to track recurring billing
CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    website_request_id INTEGER REFERENCES website_requests(id) ON DELETE CASCADE,
    plan_id INTEGER NOT NULL REFERENCES website_plans(id),
    
    -- Stripe references
    stripe_subscription_id VARCHAR(255) UNIQUE,
    stripe_customer_id VARCHAR(255),
    stripe_payment_method_id VARCHAR(255),
    
    -- Subscription details
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, canceled, past_due, unpaid
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    
    -- Pricing (stored for historical record)
    monthly_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Usage tracking
    changes_used_this_month INTEGER DEFAULT 0,
    changes_reset_date DATE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    canceled_at TIMESTAMP WITH TIME ZONE
);

-- Add indexes for subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Create payment_history table to track all payments
CREATE TABLE IF NOT EXISTS payment_history (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    website_request_id INTEGER REFERENCES website_requests(id),
    subscription_id INTEGER REFERENCES subscriptions(id),
    
    -- Stripe references
    stripe_payment_intent_id VARCHAR(255),
    stripe_invoice_id VARCHAR(255),
    
    -- Payment details
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_type VARCHAR(50) NOT NULL, -- setup_fee, monthly_subscription, one_time
    status VARCHAR(50) NOT NULL, -- succeeded, failed, pending, canceled
    
    -- Metadata
    description TEXT,
    failure_reason TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Add indexes for payment history
CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON payment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_status ON payment_history(status);
CREATE INDEX IF NOT EXISTS idx_payment_history_type ON payment_history(payment_type);

-- ===========================================
-- ROW LEVEL SECURITY FOR PAYMENT METHODS
-- ===========================================
ALTER TABLE stripe_payment_methods ENABLE ROW LEVEL SECURITY;

-- Users can only see their own payment methods
CREATE POLICY "Users can view own payment methods" ON stripe_payment_methods
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payment methods" ON stripe_payment_methods
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payment methods" ON stripe_payment_methods
    FOR UPDATE USING (auth.uid() = user_id);

-- Admins can view all payment methods (for support purposes)
CREATE POLICY "Admins can view all payment methods" ON stripe_payment_methods
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users u 
            JOIN roles r ON u.role_id = r.id 
            WHERE u.id = auth.uid() AND r.name = 'admin'
        )
    );

-- Enable RLS on new tables
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payment_methods
CREATE POLICY "Users can view their own payment methods" ON payment_methods
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own payment methods" ON payment_methods
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own payment methods" ON payment_methods
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can view all payment methods" ON payment_methods
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u 
            JOIN roles r ON u.role_id = r.id 
            WHERE u.id = auth.uid() AND r.name = 'admin'
        )
    );

-- RLS Policies for subscriptions
CREATE POLICY "Users can view their own subscriptions" ON subscriptions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all subscriptions" ON subscriptions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u 
            JOIN roles r ON u.role_id = r.id 
            WHERE u.id = auth.uid() AND r.name = 'admin'
        )
    );

-- RLS Policies for payment_history
CREATE POLICY "Users can view their own payment history" ON payment_history
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all payment history" ON payment_history
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u 
            JOIN roles r ON u.role_id = r.id 
            WHERE u.id = auth.uid() AND r.name = 'admin'
        )
    );

-- ===========================================
-- FUNCTIONS FOR PAYMENT METHOD MANAGEMENT
-- ===========================================

-- Function to add a new payment method
CREATE OR REPLACE FUNCTION add_stripe_payment_method(
    p_user_id UUID,
    p_stripe_customer_id TEXT,
    p_stripe_payment_method_id TEXT,
    p_card_brand TEXT,
    p_card_last_four TEXT,
    p_card_exp_month INTEGER,
    p_card_exp_year INTEGER,
    p_is_default BOOLEAN DEFAULT FALSE
)
RETURNS UUID AS $$
DECLARE
    payment_method_id UUID;
BEGIN
    -- If this is set as default, unset other default payment methods
    IF p_is_default THEN
        UPDATE stripe_payment_methods 
        SET is_default = FALSE 
        WHERE user_id = p_user_id AND is_default = TRUE;
    END IF;
    
    -- Insert the new payment method
    INSERT INTO stripe_payment_methods (
        user_id, 
        stripe_customer_id, 
        stripe_payment_method_id,
        card_brand,
        card_last_four,
        card_exp_month,
        card_exp_year,
        is_default
    ) VALUES (
        p_user_id,
        p_stripe_customer_id,
        p_stripe_payment_method_id,
        p_card_brand,
        p_card_last_four,
        p_card_exp_month,
        p_card_exp_year,
        p_is_default
    ) RETURNING id INTO payment_method_id;
    
    -- Update user's stripe_customer_id if not set
    UPDATE users 
    SET stripe_customer_id = p_stripe_customer_id 
    WHERE id = p_user_id AND stripe_customer_id IS NULL;
    
    RETURN payment_method_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to set default payment method
CREATE OR REPLACE FUNCTION set_default_payment_method(
    p_user_id UUID,
    p_payment_method_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Unset all default payment methods for this user
    UPDATE stripe_payment_methods 
    SET is_default = FALSE 
    WHERE user_id = p_user_id;
    
    -- Set the specified payment method as default
    UPDATE stripe_payment_methods 
    SET is_default = TRUE 
    WHERE id = p_payment_method_id AND user_id = p_user_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's default payment method
CREATE OR REPLACE FUNCTION get_default_payment_method(p_user_id UUID)
RETURNS TABLE(
    id UUID,
    stripe_payment_method_id TEXT,
    card_brand TEXT,
    card_last_four TEXT,
    card_exp_month INTEGER,
    card_exp_year INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        spm.id,
        spm.stripe_payment_method_id,
        spm.card_brand,
        spm.card_last_four,
        spm.card_exp_month,
        spm.card_exp_year
    FROM stripe_payment_methods spm
    WHERE spm.user_id = p_user_id 
    AND spm.is_default = TRUE 
    AND spm.is_active = TRUE
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create sample payment methods (after users exist)
CREATE OR REPLACE FUNCTION create_sample_payment_methods()
RETURNS TEXT AS $$
DECLARE
    sample_user_id UUID;
BEGIN
    -- Get a sample user (this will only work after you have real users)
    SELECT id INTO sample_user_id FROM users WHERE role_id = 1 LIMIT 1;
    
    IF sample_user_id IS NOT NULL THEN
        -- Add a sample payment method (using fake Stripe IDs for testing)
        PERFORM add_stripe_payment_method(
            sample_user_id,
            'cus_sample_customer_id',
            'pm_sample_payment_method_id',
            'visa',
            '4242',
            12,
            2025,
            TRUE
        );
        
        RETURN 'Sample payment method created for user: ' || sample_user_id;
    ELSE
        RETURN 'No users found to create sample payment methods';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Update triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payment_methods_updated_at
    BEFORE UPDATE ON payment_methods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- VERIFICATION QUERIES
-- ===========================================

-- Check payment methods table structure
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'stripe_payment_methods';

-- Check if payment method functions work
-- SELECT * FROM get_default_payment_method('USER_UUID_HERE');

-- ===========================================
-- INSTRUCTIONS FOR STRIPE INTEGRATION
-- ===========================================

/*
STRIPE PAYMENT FLOW:

1. USER REGISTRATION:
   - User registers through Supabase Auth
   - User profile created automatically via trigger
   - No Stripe customer created yet

2. FIRST PAYMENT (Setup Fee):
   - When user wants to pay setup fee
   - Create Stripe customer: stripe.customers.create()
   - Save stripe_customer_id to users table
   - Create payment method: stripe.paymentMethods.create()
   - Save payment method details using add_stripe_payment_method()
   - Process setup fee payment

3. RECURRING PAYMENTS:
   - Create Stripe subscription using saved payment method
   - Save subscription details to website_subscriptions table
   - Stripe handles recurring billing automatically
   - Webhook updates subscription status

4. PAYMENT METHOD MANAGEMENT:
   - Users can add/remove payment methods
   - Set default payment method for subscriptions
   - Update subscription payment method if needed

SECURITY NOTES:
- Never store actual card numbers, CVV, or full expiration dates
- Only store Stripe references and safe display info (last 4 digits, brand)
- Use Stripe's secure vault for all sensitive payment data
- Implement proper webhook signature verification
*/
