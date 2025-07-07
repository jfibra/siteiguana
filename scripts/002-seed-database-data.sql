-- ===========================================
-- SITE IGUANA DATABASE SEEDING SCRIPT
-- ===========================================

-- ===========================================
-- SEED WEBSITE PLANS
-- ===========================================

-- Clear existing plans first (optional - remove if you want to keep existing data)
-- DELETE FROM website_plans;

-- Insert comprehensive website plans
INSERT INTO website_plans (name, description, setup_fee, monthly_price, max_pages, max_changes_per_month, features, is_active) VALUES

-- Basic Plan - Perfect for simple businesses
('Basic Plan', 
 'Perfect for small businesses who need a simple, professional online presence. Great for restaurants, local services, and consultants who want to get online quickly.',
 297.00, 
 97.00, 
 5, 
 5, 
 '["Mobile Responsive Design", "Basic SEO Setup", "Contact Form", "Google Analytics", "Social Media Links", "Professional Email Setup", "SSL Certificate", "Fast Loading (Next.js)", "Basic Image Gallery"]',
 true),

-- Standard Plan - Most popular for growing businesses
('Standard Plan', 
 'Our most popular choice for growing businesses. Includes e-commerce capabilities and advanced features to help you sell online and attract more customers.',
 497.00, 
 197.00, 
 10, 
 10, 
 '["Everything in Basic Plan", "E-commerce Ready (Online Store)", "Advanced SEO Optimization", "Blog Setup", "Customer Reviews System", "Social Media Integration", "Email Newsletter Signup", "Advanced Analytics", "Online Booking System", "Payment Processing Setup"]',
 true),

-- Premium Plan - For businesses that need everything
('Premium Plan', 
 'The complete solution for businesses that want everything. Perfect for established businesses ready to dominate their market online.',
 797.00, 
 397.00, 
 25, 
 15, 
 '["Everything in Standard Plan", "Custom Functionality", "Advanced E-commerce Features", "Multi-location Support", "Customer Portal", "Advanced Booking System", "Email Marketing Integration", "Priority Support", "Monthly Strategy Calls", "Conversion Optimization", "A/B Testing Setup"]',
 true),

-- Starter Plan - Entry level for very small businesses
('Starter Plan', 
 'A simple, affordable option for brand new businesses or those just testing the waters online. Perfect for getting started quickly.',
 197.00, 
 67.00, 
 3, 
 3, 
 '["Mobile Responsive Design", "Basic Contact Page", "Simple About Page", "Contact Form", "Google Maps Integration", "Basic SEO", "SSL Certificate", "Fast Loading (Next.js)"]',
 true),

-- E-commerce Plan - Specialized for online stores
('E-commerce Plan', 
 'Specialized for businesses that want to sell products online. Everything you need to start your online store and start making sales.',
 597.00, 
 297.00, 
 15, 
 12, 
 '["Professional Online Store", "Product Catalog Management", "Shopping Cart & Checkout", "Payment Processing (Stripe/PayPal)", "Inventory Management", "Order Management System", "Customer Accounts", "Email Receipts", "Shipping Calculator", "Tax Calculation", "Discount Codes", "Mobile Responsive", "Advanced SEO"]',
 true)

ON CONFLICT (name) DO UPDATE SET
    description = EXCLUDED.description,
    setup_fee = EXCLUDED.setup_fee,
    monthly_price = EXCLUDED.monthly_price,
    max_pages = EXCLUDED.max_pages,
    max_changes_per_month = EXCLUDED.max_changes_per_month,
    features = EXCLUDED.features,
    is_active = EXCLUDED.is_active;

-- ===========================================
-- CREATE ADMIN USER
-- ===========================================

-- Note: The user must first be created in Supabase Auth
-- You'll need to manually register iguana@gmail.com through the Supabase Auth UI first
-- Then run this script to update their role and profile

-- First, let's create a function to set up the admin user
CREATE OR REPLACE FUNCTION setup_admin_user(user_email TEXT)
RETURNS TEXT AS $$
DECLARE
    user_uuid UUID;
    admin_role_id INTEGER;
    result_message TEXT;
BEGIN
    -- Get the admin role ID
    SELECT id INTO admin_role_id FROM roles WHERE name = 'admin';
    
    -- Find the user by email in auth.users
    SELECT id INTO user_uuid 
    FROM auth.users 
    WHERE email = user_email;
    
    IF user_uuid IS NULL THEN
        RETURN 'User with email ' || user_email || ' not found. Please register this user first through Supabase Auth.';
    END IF;
    
    -- Update or insert the user profile
    INSERT INTO users (id, role_id, first_name, last_name, company_name, status)
    VALUES (
        user_uuid,
        admin_role_id,
        'Iguana',
        'Overseer',
        'Site Iguana',
        'active'
    )
    ON CONFLICT (id) DO UPDATE SET
        role_id = admin_role_id,
        first_name = 'Iguana',
        last_name = 'Overseer',
        company_name = 'Site Iguana',
        status = 'active';
    
    RETURN 'Admin user setup completed for ' || user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Call the function (this will only work after the user is registered in Supabase Auth)
-- SELECT setup_admin_user('iguana@gmail.com');

-- ===========================================
-- SAMPLE WEBSITE REQUESTS FOR TESTING
-- ===========================================

-- Note: These will only work after you have actual user UUIDs
-- Replace 'SAMPLE_USER_UUID' with real UUIDs after users are created

-- Sample website request 1 - Pending approval
/*
INSERT INTO website_requests (
    user_id, 
    plan_id, 
    business_name, 
    business_description, 
    website_purpose, 
    target_audience, 
    preferred_colors, 
    reference_websites, 
    special_requirements,
    status
) VALUES (
    'SAMPLE_USER_UUID_1', 
    1, -- Basic Plan
    'Mario''s Pizza Palace', 
    'Family-owned Italian restaurant serving authentic pizza and pasta for over 20 years in downtown Springfield.',
    'To showcase our menu, allow online ordering, and help customers find us easily. We want to compete with the big chains.',
    'Local families, pizza lovers, people looking for authentic Italian food, office workers ordering lunch',
    'Red, green, and white (Italian flag colors), warm and inviting',
    'https://www.dominos.com, https://www.papajohns.com (but more authentic and family-focused)',
    'Need online menu with prices, photo gallery of our food, customer reviews section, and integration with our existing POS system if possible',
    'pending_approval'
);
*/

-- Sample website request 2 - In progress
/*
INSERT INTO website_requests (
    user_id, 
    plan_id, 
    business_name, 
    business_description, 
    website_purpose, 
    target_audience, 
    preferred_colors, 
    reference_websites, 
    special_requirements,
    status,
    approved_by,
    approved_at,
    setup_fee_paid,
    setup_payment_date
) VALUES (
    'SAMPLE_USER_UUID_2', 
    2, -- Standard Plan
    'Smith & Associates Law Firm', 
    'Full-service law firm specializing in personal injury, family law, and business litigation with 15 years of experience.',
    'To establish credibility online, attract new clients, and provide information about our services and expertise.',
    'People needing legal help, other attorneys for referrals, potential business clients',
    'Navy blue, gold, white - professional and trustworthy',
    'https://www.martindale.com, other professional law firm websites',
    'Need attorney profiles, case results (where legally allowed), client testimonials, and secure contact forms for consultations',
    'in_progress',
    'ADMIN_USER_UUID',
    NOW() - INTERVAL '5 days',
    true,
    NOW() - INTERVAL '5 days'
);
*/

-- ===========================================
-- SAMPLE NOTIFICATIONS FOR TESTING
-- ===========================================

-- Function to create sample notifications
CREATE OR REPLACE FUNCTION create_sample_notifications()
RETURNS TEXT AS $$
DECLARE
    sample_user_id UUID;
    sample_request_id UUID;
BEGIN
    -- This is just a template - you'll need real UUIDs
    -- Get a sample user and request (replace with actual data)
    /*
    SELECT id INTO sample_user_id FROM users WHERE role_id = 1 LIMIT 1;
    SELECT id INTO sample_request_id FROM website_requests LIMIT 1;
    
    IF sample_user_id IS NOT NULL THEN
        -- Welcome notification
        INSERT INTO notifications (user_id, title, message, type) VALUES
        (sample_user_id, 'Welcome to Site Iguana!', 'Thank you for choosing Site Iguana for your website needs. We''re excited to help your business grow online!', 'success');
        
        -- Status update notification
        IF sample_request_id IS NOT NULL THEN
            INSERT INTO notifications (user_id, title, message, type, website_request_id) VALUES
            (sample_user_id, 'Website Request Approved!', 'Great news! Your website request has been approved. Please proceed with payment to start the development process.', 'status_update', sample_request_id);
        END IF;
    END IF;
    */
    
    RETURN 'Sample notifications template created (commented out - needs real user IDs)';
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- SAMPLE ADMIN ACTIVITY LOG
-- ===========================================

-- Function to create sample admin activity
CREATE OR REPLACE FUNCTION create_sample_admin_activity()
RETURNS TEXT AS $$
BEGIN
    -- This will be populated automatically as admins use the system
    -- The triggers will handle logging admin actions
    
    RETURN 'Admin activity logging is set up and will populate automatically';
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- UTILITY FUNCTIONS FOR TESTING
-- ===========================================

-- Function to get plan recommendations based on requirements
CREATE OR REPLACE FUNCTION get_plan_recommendation(
    pages_needed INTEGER DEFAULT 5,
    needs_ecommerce BOOLEAN DEFAULT FALSE,
    needs_booking BOOLEAN DEFAULT FALSE,
    budget_range TEXT DEFAULT 'standard' -- 'budget', 'standard', 'premium'
)
RETURNS TABLE(
    plan_id INTEGER,
    plan_name VARCHAR(100),
    setup_fee DECIMAL(10,2),
    monthly_price DECIMAL(10,2),
    recommendation_reason TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        wp.id,
        wp.name,
        wp.setup_fee,
        wp.monthly_price,
        CASE 
            WHEN needs_ecommerce AND wp.name LIKE '%E-commerce%' THEN 'Perfect for online selling'
            WHEN pages_needed <= 3 AND wp.name = 'Starter Plan' THEN 'Great for simple websites'
            WHEN pages_needed <= 5 AND wp.name = 'Basic Plan' THEN 'Perfect for small businesses'
            WHEN pages_needed <= 10 AND wp.name = 'Standard Plan' THEN 'Great for growing businesses'
            WHEN pages_needed > 10 AND wp.name = 'Premium Plan' THEN 'Best for established businesses'
            ELSE 'Good option for your needs'
        END as recommendation_reason
    FROM website_plans wp
    WHERE wp.is_active = true
    ORDER BY 
        CASE 
            WHEN needs_ecommerce AND wp.name LIKE '%E-commerce%' THEN 1
            WHEN pages_needed <= 3 AND wp.name = 'Starter Plan' THEN 1
            WHEN pages_needed <= 5 AND wp.name = 'Basic Plan' THEN 1
            WHEN pages_needed <= 10 AND wp.name = 'Standard Plan' THEN 1
            WHEN pages_needed > 10 AND wp.name = 'Premium Plan' THEN 1
            ELSE 2
        END,
        wp.monthly_price;
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- DATA VERIFICATION QUERIES
-- ===========================================

-- Query to verify the data was inserted correctly
-- Run these after executing the script to confirm everything worked

-- Check website plans
-- SELECT * FROM website_plans ORDER BY monthly_price;

-- Check roles
-- SELECT * FROM roles;

-- Check if admin user exists (run after registering the user)
-- SELECT u.*, r.name as role_name 
-- FROM users u 
-- JOIN roles r ON u.role_id = r.id 
-- WHERE u.first_name = 'Iguana';

-- Test plan recommendation function
-- SELECT * FROM get_plan_recommendation(5, false, false, 'standard');
-- SELECT * FROM get_plan_recommendation(1, true, false, 'budget');

-- ===========================================
-- INSTRUCTIONS FOR SETUP
-- ===========================================

/*
SETUP INSTRUCTIONS:

1. First, run the main database schema script (001-complete-database-schema.sql)

2. Run this seeding script (002-seed-database-data.sql)

3. Register the admin user manually:
   - Go to your Supabase Auth dashboard
   - Create a new user with email: iguana@gmail.com
   - Set password: xxx222@123
   - Note down the user UUID

4. Update the admin user role:
   - Run: SELECT setup_admin_user('iguana@gmail.com');
   - This will set the user as admin with proper profile

5. Test the setup:
   - Run the verification queries at the bottom
   - Check that plans are created
   - Verify admin user has correct role

6. Optional - Create sample data:
   - Register a few test users through your app
   - Create sample website requests
   - Test the workflow

The database is now ready for your Site Iguana application!
*/

-- ===========================================
-- FINAL VERIFICATION
-- ===========================================

-- Display summary of what was created
SELECT 
    'Website Plans' as table_name,
    COUNT(*) as record_count
FROM website_plans
WHERE is_active = true

UNION ALL

SELECT 
    'Roles' as table_name,
    COUNT(*) as record_count
FROM roles

UNION ALL

SELECT 
    'Users' as table_name,
    COUNT(*) as record_count
FROM users;

-- Show the created plans
SELECT 
    name,
    setup_fee,
    monthly_price,
    max_pages,
    max_changes_per_month
FROM website_plans 
WHERE is_active = true
ORDER BY monthly_price;
