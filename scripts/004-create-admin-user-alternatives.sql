-- ===========================================
-- ALTERNATIVE METHODS TO CREATE ADMIN USER
-- ===========================================

-- First, let's check what we have in the roles table
SELECT 'Current roles:' as info;
SELECT * FROM roles;

-- ===========================================
-- METHOD 1: CREATE USER DIRECTLY (FIXED VERSION)
-- ===========================================

-- Function to create admin user directly with better error handling
CREATE OR REPLACE FUNCTION create_admin_user_direct(
    p_email TEXT DEFAULT 'iguana@gmail.com',
    p_password TEXT DEFAULT 'xxx222@123',
    p_first_name TEXT DEFAULT 'Iguana',
    p_last_name TEXT DEFAULT 'Overseer'
)
RETURNS TEXT AS $$
DECLARE
    new_user_id UUID;
    admin_role_id INTEGER;
    existing_user_id UUID;
    result_text TEXT;
BEGIN
    -- Generate a new UUID for the user
    new_user_id := gen_random_uuid();
    
    -- Get admin role ID
    SELECT id INTO admin_role_id FROM roles WHERE name = 'admin';
    
    IF admin_role_id IS NULL THEN
        RETURN 'ERROR: Admin role not found. Please run the initial schema script first.';
    END IF;
    
    -- Check if user already exists in auth.users
    SELECT id INTO existing_user_id FROM auth.users WHERE email = p_email;
    
    IF existing_user_id IS NOT NULL THEN
        -- User exists in auth, just update the profile
        INSERT INTO users (
            id,
            role_id,
            first_name,
            last_name,
            company_name,
            status
        ) VALUES (
            existing_user_id,
            admin_role_id,
            p_first_name,
            p_last_name,
            'Site Iguana',
            'active'
        )
        ON CONFLICT (id) DO UPDATE SET
            role_id = admin_role_id,
            first_name = p_first_name,
            last_name = p_last_name,
            company_name = 'Site Iguana',
            status = 'active';
            
        RETURN 'SUCCESS: Updated existing user ' || p_email || ' to admin role with ID: ' || existing_user_id;
    END IF;
    
    -- Try to insert into auth.users table directly
    BEGIN
        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            role,
            aud,
            confirmation_token,
            email_confirmed_at
        ) VALUES (
            new_user_id,
            '00000000-0000-0000-0000-000000000000',
            p_email,
            crypt(p_password, gen_salt('bf')),
            NOW(),
            NOW(),
            NOW(),
            'authenticated',
            'authenticated',
            '',
            NOW()
        );
        
        result_text := 'Created auth user with ID: ' || new_user_id;
        
    EXCEPTION
        WHEN OTHERS THEN
            result_text := 'Could not create auth user (this is normal if auth.users is protected): ' || SQLERRM;
    END;
    
    -- Insert into users table (our custom profile table)
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
        p_first_name,
        p_last_name,
        'Site Iguana',
        'active'
    );
    
    RETURN 'SUCCESS: ' || result_text || '. Profile created with ID: ' || new_user_id || ' and email: ' || p_email;
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN 'ERROR creating admin user: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- METHOD 2: CREATE PROFILE-ONLY ADMIN USER
-- ===========================================

-- Function to create admin user profile (without auth - for testing)
CREATE OR REPLACE FUNCTION create_admin_profile_only()
RETURNS TEXT AS $$
DECLARE
    new_user_id UUID;
    admin_role_id INTEGER;
BEGIN
    -- Generate a new UUID
    new_user_id := gen_random_uuid();
    
    -- Get admin role ID
    SELECT id INTO admin_role_id FROM roles WHERE name = 'admin';
    
    IF admin_role_id IS NULL THEN
        RETURN 'ERROR: Admin role not found in roles table';
    END IF;
    
    -- Insert directly into users table
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
    
    RETURN 'SUCCESS: Admin profile created with ID: ' || new_user_id || ' (Note: This is profile-only, no auth login)';
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN 'ERROR: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- METHOD 3: MANUAL INSERT WITH KNOWN UUID
-- ===========================================

-- Function to create admin with specific UUID (useful if you create auth user manually)
CREATE OR REPLACE FUNCTION create_admin_with_uuid(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
    admin_role_id INTEGER;
BEGIN
    -- Get admin role ID
    SELECT id INTO admin_role_id FROM roles WHERE name = 'admin';
    
    IF admin_role_id IS NULL THEN
        RETURN 'ERROR: Admin role not found';
    END IF;
    
    -- Insert into users table with provided UUID
    INSERT INTO users (
        id,
        role_id,
        first_name,
        last_name,
        company_name,
        status
    ) VALUES (
        p_user_id,
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
    
    RETURN 'SUCCESS: Admin profile created/updated for UUID: ' || p_user_id;
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN 'ERROR: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- VERIFICATION FUNCTIONS
-- ===========================================

-- Function to check what users exist
CREATE OR REPLACE FUNCTION check_all_users()
RETURNS TABLE(
    source TEXT,
    user_id UUID,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    role_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    -- Return users from our users table
    RETURN QUERY
    SELECT 
        'users_table'::TEXT as source,
        u.id,
        'N/A'::TEXT as email,
        u.first_name,
        u.last_name,
        r.name as role_name,
        u.created_at
    FROM users u
    JOIN roles r ON u.role_id = r.id
    ORDER BY u.created_at DESC;
    
    -- Try to also get from auth.users if accessible
    BEGIN
        RETURN QUERY
        SELECT 
            'auth_table'::TEXT as source,
            au.id,
            au.email,
            'N/A'::TEXT as first_name,
            'N/A'::TEXT as last_name,
            'N/A'::TEXT as role_name,
            au.created_at
        FROM auth.users au
        ORDER BY au.created_at DESC;
    EXCEPTION
        WHEN OTHERS THEN
            -- auth.users not accessible, skip
            NULL;
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check roles
CREATE OR REPLACE FUNCTION check_roles()
RETURNS TABLE(
    role_id INTEGER,
    role_name VARCHAR(50),
    role_description TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT id, name, description FROM roles ORDER BY id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- EXECUTE AND TEST
-- ===========================================

-- First, let's see what roles we have
SELECT 'CHECKING ROLES:' as step;
SELECT * FROM check_roles();

-- Try Method 1: Create admin user directly
SELECT 'TRYING METHOD 1 - Direct Creation:' as step;
SELECT create_admin_user_direct();

-- Check what users we have now
SELECT 'CHECKING USERS AFTER METHOD 1:' as step;
SELECT * FROM check_all_users();

-- If Method 1 didn't work, try Method 2: Profile only
SELECT 'TRYING METHOD 2 - Profile Only:' as step;
SELECT create_admin_profile_only();

-- Check users again
SELECT 'CHECKING USERS AFTER METHOD 2:' as step;
SELECT * FROM check_all_users();

-- Final verification - count users by role
SELECT 'FINAL COUNT BY ROLE:' as step;
SELECT 
    r.name as role_name,
    COUNT(u.id) as user_count
FROM roles r
LEFT JOIN users u ON r.id = u.role_id
GROUP BY r.id, r.name
ORDER BY r.id;
