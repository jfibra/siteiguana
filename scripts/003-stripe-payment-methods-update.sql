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
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Add more Stripe fields to website_subscriptions table
ALTER TABLE website_subscriptions ADD COLUMN IF NOT EXISTS stripe_price_id TEXT; -- Stripe price ID for the plan
ALTER TABLE website_subscriptions ADD COLUMN IF NOT EXISTS stripe_payment_method_id TEXT; -- Default payment method for this subscription

-- Add Stripe fields to payment_transactions table
ALTER TABLE payment_transactions ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE payment_transactions ADD COLUMN IF NOT EXISTS stripe_payment_method_id TEXT;

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

-- ===========================================
-- UPDATED SEEDING SCRIPT WITH PROPER USER CREATION
-- ===========================================

-- Function to create a complete admin user (Auth + Profile)
CREATE OR REPLACE FUNCTION create_admin_user_complete(
    p_email TEXT,
    p_password TEXT,
    p_first_name TEXT DEFAULT 'Iguana',
    p_last_name TEXT DEFAULT 'Overseer'
)
RETURNS TEXT AS $$
DECLARE
    admin_role_id INTEGER;
    result_message TEXT;
BEGIN
    -- Get the admin role ID
    SELECT id INTO admin_role_id FROM roles WHERE name = 'admin';
    
    -- Note: This function provides the structure, but you still need to create
    -- the user through Supabase Auth UI or API first, then run setup_admin_user()
    
    result_message := 'To create admin user: 
    1. Go to Supabase Auth Dashboard
    2. Create user with email: ' || p_email || '
    3. Set password: ' || p_password || '
    4. Then run: SELECT setup_admin_user(''' || p_email || ''');';
    
    RETURN result_message;
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- SAMPLE PAYMENT METHODS (for testing)
-- ===========================================

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
