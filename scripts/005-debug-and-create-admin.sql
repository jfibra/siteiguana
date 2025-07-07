-- ===========================================
-- DEBUG AND CREATE ADMIN USER - SIMPLE APPROACH
-- ===========================================

-- First, let's check if our tables and roles exist
SELECT 'STEP 1: Checking if roles table exists and has data' as debug_step;
SELECT COUNT(*) as role_count FROM roles;
SELECT * FROM roles;

SELECT 'STEP 2: Checking if users table exists' as debug_step;
SELECT COUNT(*) as user_count FROM users;

-- Let's check the exact structure of our users table
SELECT 'STEP 3: Users table structure' as debug_step;
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- ===========================================
-- CHECK AND FIX FOREIGN KEY CONSTRAINTS
-- ===========================================

-- Check what foreign key constraints exist on users table
SELECT 'STEP 4: Checking foreign key constraints' as debug_step;
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu 
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'users' AND tc.constraint_type = 'FOREIGN KEY';

-- The error suggests users.id has a foreign key to users table (circular reference)
-- Let's drop this problematic constraint
SELECT 'STEP 5: Fixing foreign key constraint' as debug_step;

-- Drop the problematic foreign key constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_id_fkey;

-- Also check if there are other problematic constraints
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_user_id_fkey;
ALTER TABLE users DROP CONSTRAINT IF EXISTS fk_users_id;

-- The users.id should be a PRIMARY KEY, not a foreign key to itself
-- Let's make sure the primary key constraint exists
ALTER TABLE users ADD CONSTRAINT users_pkey PRIMARY KEY (id);

-- ===========================================
-- NOW TRY TO INSERT ADMIN USER
-- ===========================================

SELECT 'STEP 6: Attempting to insert admin user after fixing constraints' as debug_step;

DO $$
DECLARE
    new_user_id UUID;
    admin_role_id INTEGER;
BEGIN
    -- Generate UUID
    new_user_id := gen_random_uuid();
    
    -- Get admin role ID
    SELECT id INTO admin_role_id FROM roles WHERE name = 'admin';
    
    -- Print debug info
    RAISE NOTICE 'Generated UUID: %', new_user_id;
    RAISE NOTICE 'Admin role ID: %', admin_role_id;
    
    -- Direct insert
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
        new_user_id,
        admin_role_id,
        'Iguana',
        'Overseer',
        'Site Iguana',
        'active',
        NOW(),
        NOW()
    );
    
    RAISE NOTICE 'User inserted successfully with ID: %', new_user_id;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error inserting user: %', SQLERRM;
END $$;

-- Check if the insert worked
SELECT 'STEP 7: Checking users after constraint fix' as debug_step;
SELECT * FROM users;

-- ===========================================
-- ALTERNATIVE: SIMPLE INSERT WITHOUT DO BLOCK
-- ===========================================

-- If the DO block didn't work, try a simple INSERT
SELECT 'STEP 8: Simple INSERT approach' as debug_step;

INSERT INTO users (
    id,
    role_id,
    first_name,
    last_name,
    company_name,
    status,
    created_at,
    updated_at
) 
VALUES (
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

-- Check again
SELECT 'STEP 9: After simple insert' as debug_step;
SELECT * FROM users;

-- ===========================================
-- CREATE MULTIPLE ADMIN USERS FOR TESTING
-- ===========================================

-- Let's create a few admin users to make sure it works
SELECT 'STEP 10: Creating multiple admin users' as debug_step;

INSERT INTO users (id, role_id, first_name, last_name, company_name, status, created_at, updated_at) VALUES
(gen_random_uuid(), (SELECT id FROM roles WHERE name = 'admin'), 'Iguana', 'Admin', 'Site Iguana', 'active', NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM roles WHERE name = 'admin'), 'Test', 'Admin', 'Site Iguana', 'active', NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM roles WHERE name = 'user'), 'Test', 'User', 'Test Company', 'active', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ===========================================
-- FINAL VERIFICATION
-- ===========================================

SELECT 'STEP 11: FINAL VERIFICATION' as debug_step;
SELECT 
    u.id,
    u.first_name,
    u.last_name,
    u.company_name,
    r.name as role_name,
    u.status,
    u.created_at
FROM users u
JOIN roles r ON u.role_id = r.id
ORDER BY u.created_at DESC;

-- Count by role
SELECT 'User count by role:' as info;
SELECT 
    r.name as role_name,
    COUNT(u.id) as user_count
FROM roles r
LEFT JOIN users u ON r.id = u.role_id
GROUP BY r.id, r.name
ORDER BY r.id;

-- ===========================================
-- CHECK FINAL CONSTRAINTS
-- ===========================================

-- Verify the constraints are correct now
SELECT 'Final constraint check:' as info;
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    COALESCE(ccu.table_name, 'N/A') AS foreign_table_name,
    COALESCE(ccu.column_name, 'N/A') AS foreign_column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
LEFT JOIN information_schema.constraint_column_usage ccu 
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'users'
ORDER BY tc.constraint_type, tc.constraint_name;

-- ===========================================
-- CREATE FUNCTION FOR FUTURE ADMIN CREATION
-- ===========================================

-- Now create a working function for future use
CREATE OR REPLACE FUNCTION create_admin_user_working(
    p_email TEXT DEFAULT 'iguana@gmail.com',
    p_first_name TEXT DEFAULT 'Iguana',
    p_last_name TEXT DEFAULT 'Overseer'
)
RETURNS TEXT AS $$
DECLARE
    new_user_id UUID;
    admin_role_id INTEGER;
BEGIN
    -- Generate UUID
    new_user_id := gen_random_uuid();
    
    -- Get admin role ID
    SELECT id INTO admin_role_id FROM roles WHERE name = 'admin';
    
    IF admin_role_id IS NULL THEN
        RETURN 'ERROR: Admin role not found';
    END IF;
    
    -- Insert user
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
        new_user_id,
        admin_role_id,
        p_first_name,
        p_last_name,
        'Site Iguana',
        'active',
        NOW(),
        NOW()
    );
    
    RETURN 'SUCCESS: Admin user created with ID: ' || new_user_id || ' (Email: ' || p_email || ')';
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN 'ERROR: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Test the function
SELECT 'Testing working function:' as info;
SELECT create_admin_user_working('admin@siteiguana.com', 'Site', 'Administrator');

-- Final user list
SELECT 'FINAL USER LIST:' as result;
SELECT 
    u.id,
    u.first_name || ' ' || u.last_name as full_name,
    u.company_name,
    r.name as role,
    u.status,
    u.created_at
FROM users u
JOIN roles r ON u.role_id = r.id
ORDER BY u.created_at DESC;
