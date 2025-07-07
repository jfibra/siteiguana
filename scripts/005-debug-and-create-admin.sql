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
-- DIRECT INSERT APPROACH (NO FUNCTIONS)
-- ===========================================

-- Let's try a direct insert without any functions
SELECT 'STEP 4: Attempting direct insert' as debug_step;

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
        status
    ) VALUES (
        new_user_id,
        admin_role_id,
        'Iguana',
        'Overseer',
        'Site Iguana',
        'active'
    );
    
    RAISE NOTICE 'User inserted successfully with ID: %', new_user_id;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error inserting user: %', SQLERRM;
END $$;

-- Check if the insert worked
SELECT 'STEP 5: Checking users after direct insert' as debug_step;
SELECT * FROM users;

-- ===========================================
-- ALTERNATIVE: INSERT WITH SPECIFIC UUID
-- ===========================================

-- If the above didn't work, let's try with a specific UUID
SELECT 'STEP 6: Trying with specific UUID' as debug_step;

DO $$
DECLARE
    specific_user_id UUID := '12345678-1234-1234-1234-123456789012';
    admin_role_id INTEGER;
BEGIN
    -- Get admin role ID
    SELECT id INTO admin_role_id FROM roles WHERE name = 'admin';
    
    -- Try insert with specific UUID
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
        specific_user_id,
        admin_role_id,
        'Iguana',
        'Overseer',
        'Site Iguana',
        'active',
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        role_id = admin_role_id,
        first_name = 'Iguana',
        last_name = 'Overseer',
        updated_at = NOW();
    
    RAISE NOTICE 'User inserted/updated with specific UUID: %', specific_user_id;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error with specific UUID: %', SQLERRM;
END $$;

-- Check again
SELECT 'STEP 7: Final check after specific UUID insert' as debug_step;
SELECT * FROM users;

-- ===========================================
-- MANUAL INSERT (SIMPLEST POSSIBLE)
-- ===========================================

-- Let's try the absolute simplest insert possible
SELECT 'STEP 8: Manual insert with hardcoded values' as debug_step;

-- First, let's get the admin role ID manually
SELECT 'Admin role info:' as info, id as admin_role_id FROM roles WHERE name = 'admin';

-- Now insert manually (replace the role_id with the actual number from above)
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
SELECT 
    gen_random_uuid(),
    (SELECT id FROM roles WHERE name = 'admin'),
    'Iguana',
    'Overseer', 
    'Site Iguana',
    'active',
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM users u 
    JOIN roles r ON u.role_id = r.id 
    WHERE r.name = 'admin' AND u.first_name = 'Iguana'
);

-- Final verification
SELECT 'STEP 9: FINAL VERIFICATION' as debug_step;
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
-- TROUBLESHOOTING QUERIES
-- ===========================================

-- Check if there are any constraints or triggers that might be preventing inserts
SELECT 'Table constraints:' as info;
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'users';

-- Check if RLS is blocking inserts
SELECT 'Row Level Security status:' as info;
SELECT schemaname, tablename, rowsecurity, forcerowsecurity
FROM pg_tables 
WHERE tablename = 'users';

-- Check if there are any policies
SELECT 'RLS Policies:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'users';

-- ===========================================
-- DISABLE RLS TEMPORARILY FOR TESTING
-- ===========================================

-- If RLS is preventing inserts, let's temporarily disable it
SELECT 'Temporarily disabling RLS for testing' as info;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Try insert again with RLS disabled
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
SELECT 
    gen_random_uuid(),
    (SELECT id FROM roles WHERE name = 'admin'),
    'Iguana',
    'Admin',
    'Site Iguana',
    'active',
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM users u 
    JOIN roles r ON u.role_id = r.id 
    WHERE r.name = 'admin' AND u.first_name = 'Iguana'
);

-- Check if it worked
SELECT 'After disabling RLS:' as info;
SELECT * FROM users;

-- Re-enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
SELECT 'RLS re-enabled' as info;

-- Final check
SELECT 'FINAL RESULT:' as result;
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
