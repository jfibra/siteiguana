-- ===========================================
-- FIX DATABASE CONSTRAINTS AND RELATIONSHIPS
-- ===========================================

-- This script fixes the foreign key constraint issues in the database

-- ===========================================
-- 1. FIX USERS TABLE CONSTRAINTS
-- ===========================================

-- Drop problematic foreign key constraints on users table
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_id_fkey;
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_user_id_fkey;
ALTER TABLE users DROP CONSTRAINT IF EXISTS fk_users_id;

-- Ensure users table has proper primary key
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE users ADD CONSTRAINT users_pkey PRIMARY KEY (id);

-- Ensure proper foreign key to roles table
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_id_fkey;
ALTER TABLE users ADD CONSTRAINT users_role_id_fkey 
    FOREIGN KEY (role_id) REFERENCES roles(id);

-- ===========================================
-- 2. FIX OTHER TABLE CONSTRAINTS
-- ===========================================

-- Fix website_requests foreign keys
ALTER TABLE website_requests DROP CONSTRAINT IF EXISTS website_requests_user_id_fkey;
ALTER TABLE website_requests ADD CONSTRAINT website_requests_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE website_requests DROP CONSTRAINT IF EXISTS website_requests_plan_id_fkey;
ALTER TABLE website_requests ADD CONSTRAINT website_requests_plan_id_fkey 
    FOREIGN KEY (plan_id) REFERENCES website_plans(id);

-- Fix website_subscriptions foreign keys
ALTER TABLE website_subscriptions DROP CONSTRAINT IF EXISTS website_subscriptions_user_id_fkey;
ALTER TABLE website_subscriptions ADD CONSTRAINT website_subscriptions_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE website_subscriptions DROP CONSTRAINT IF EXISTS website_subscriptions_website_request_id_fkey;
ALTER TABLE website_subscriptions ADD CONSTRAINT website_subscriptions_website_request_id_fkey 
    FOREIGN KEY (website_request_id) REFERENCES website_requests(id) ON DELETE CASCADE;

-- Fix user_remarks foreign keys
ALTER TABLE user_remarks DROP CONSTRAINT IF EXISTS user_remarks_user_id_fkey;
ALTER TABLE user_remarks ADD CONSTRAINT user_remarks_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE user_remarks DROP CONSTRAINT IF EXISTS user_remarks_website_request_id_fkey;
ALTER TABLE user_remarks ADD CONSTRAINT user_remarks_website_request_id_fkey 
    FOREIGN KEY (website_request_id) REFERENCES website_requests(id) ON DELETE CASCADE;

-- Fix notifications foreign keys
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;
ALTER TABLE notifications ADD CONSTRAINT notifications_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_website_request_id_fkey;
ALTER TABLE notifications ADD CONSTRAINT notifications_website_request_id_fkey 
    FOREIGN KEY (website_request_id) REFERENCES website_requests(id) ON DELETE CASCADE;

-- Fix payment_transactions foreign keys
ALTER TABLE payment_transactions DROP CONSTRAINT IF EXISTS payment_transactions_user_id_fkey;
ALTER TABLE payment_transactions ADD CONSTRAINT payment_transactions_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE payment_transactions DROP CONSTRAINT IF EXISTS payment_transactions_website_request_id_fkey;
ALTER TABLE payment_transactions ADD CONSTRAINT payment_transactions_website_request_id_fkey 
    FOREIGN KEY (website_request_id) REFERENCES website_requests(id) ON DELETE CASCADE;

-- Fix admin_activity_log foreign keys
ALTER TABLE admin_activity_log DROP CONSTRAINT IF EXISTS admin_activity_log_admin_user_id_fkey;
ALTER TABLE admin_activity_log ADD CONSTRAINT admin_activity_log_admin_user_id_fkey 
    FOREIGN KEY (admin_user_id) REFERENCES users(id) ON DELETE CASCADE;

-- ===========================================
-- 3. VERIFY CONSTRAINTS ARE CORRECT
-- ===========================================

-- Show all constraints for verification
SELECT 
    'Table: ' || tc.table_name as table_info,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    COALESCE(ccu.table_name, 'N/A') AS references_table,
    COALESCE(ccu.column_name, 'N/A') AS references_column
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
LEFT JOIN information_schema.constraint_column_usage ccu 
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name IN ('users', 'website_requests', 'website_subscriptions', 'user_remarks', 'notifications', 'payment_transactions', 'admin_activity_log')
ORDER BY tc.table_name, tc.constraint_type, tc.constraint_name;

-- ===========================================
-- 4. CREATE ADMIN USER NOW THAT CONSTRAINTS ARE FIXED
-- ===========================================

-- Insert admin user directly
INSERT INTO users (
    id,
    role_id,
    first_name,
    last_name,
    company_name,
    status,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM roles WHERE name = 'admin'),
    'Iguana',
    'Overseer',
    'Site Iguana',
    'active',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Verify admin user was created
SELECT 'Admin user created:' as result;
SELECT 
    u.id,
    u.first_name || ' ' || u.last_name as full_name,
    u.company_name,
    r.name as role,
    u.status,
    u.created_at
FROM users u
JOIN roles r ON u.role_id = r.id
WHERE r.name = 'admin'
ORDER BY u.created_at DESC;
