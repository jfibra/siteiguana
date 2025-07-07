-- ===========================================
-- ALTERNATIVE METHODS TO CREATE ADMIN USER
-- ===========================================

-- ===========================================
-- METHOD 1: CREATE USER DIRECTLY IN AUTH.USERS
-- ===========================================

-- Function to create admin user directly (bypassing Supabase Auth UI)
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
    hashed_password TEXT;
BEGIN
    -- Generate a new UUID for the user
    new_user_id := gen_random_uuid();
    
    -- Get admin role ID
    SELECT id INTO admin_role_id FROM roles WHERE name = 'admin';
    
    -- Create a simple hash for the password (Note: This is basic, Supabase uses more complex hashing)
    hashed_password := crypt(p_password, gen_salt('bf'));
    
    -- Insert into auth.users table directly
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        role,
        aud
    ) VALUES (
        new_user_id,
        '00000000-0000-0000-0000-000000000000',
        p_email,
        hashed_password,
        NOW(),
        NOW(),
        NOW(),
        'authenticated',
        'authenticated'
    );
    
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
    
    RETURN 'Admin user created successfully with ID: ' || new_user_id || ' and email: ' || p_email;
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN 'Error creating admin user: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- METHOD 2: CREATE TEMPORARY ADMIN USER
-- ===========================================

-- Function to create a temporary admin user for testing
CREATE OR REPLACE FUNCTION create_temp_admin_user()
RETURNS TEXT AS $$
DECLARE
    temp_user_id UUID;
    admin_role_id INTEGER;
BEGIN
    -- Generate a temporary UUID
    temp_user_id := gen_random_uuid();
    
    -- Get admin role ID
    SELECT id INTO admin_role_id FROM roles WHERE name = 'admin';
    
    -- Insert directly into users table (bypassing auth for testing)
    INSERT INTO users (
        id,
        role_id,
        first_name,
        last_name,
        company_name,
        status
    ) VALUES (
        temp_user_id,
        admin_role_id,
        'Temp',
        'Admin',
        'Site Iguana',
        'active'
    );
    
    RETURN 'Temporary admin user created with ID: ' || temp_user_id || ' (Note: This user cannot login through auth, only for database testing)';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- METHOD 3: ENABLE USER REGISTRATION IN SUPABASE
-- ===========================================

-- Instructions to enable user registration in Supabase
/*
If you can't create users in Supabase Auth dashboard, try these steps:

1. GO TO SUPABASE DASHBOARD:
   - Navigate to Authentication > Settings
   - Make sure "Enable email confirmations" is turned OFF for testing
   - Make sure "Enable sign ups" is turned ON

2. CREATE USER VIA SQL (if auth.users is accessible):
   - Run: SELECT create_admin_user_direct();
   - This will create the user directly in the auth.users table

3. CREATE USER VIA API (using curl or Postman):
   - POST to: https://your-project.supabase.co/auth/v1/signup
   - Headers: 
     * Content-Type: application/json
     * apikey: your-anon-key
   - Body: {"email": "iguana@gmail.com", "password": "xxx222@123"}

4. CREATE USER VIA JAVASCRIPT (in browser console):
   - Go to your Supabase project dashboard
   - Open browser console
   - Run the JavaScript code below
*/

-- ===========================================
-- METHOD 4: JAVASCRIPT CODE TO CREATE USER
-- ===========================================

/*
// Run this in your browser console on the Supabase dashboard page
// or in your application

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_ANON_KEY'

fetch(`${supabaseUrl}/auth/v1/signup`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': supabaseKey
  },
  body: JSON.stringify({
    email: 'iguana@gmail.com',
    password: 'xxx222@123'
  })
})
.then(response => response.json())
.then(data => {
  console.log('User created:', data);
  // After user is created, run the SQL function to set admin role
  // SELECT setup_admin_user('iguana@gmail.com');
})
.catch(error => console.error('Error:', error));
*/

-- ===========================================
-- VERIFICATION AND TESTING
-- ===========================================

-- Function to check if admin user exists
CREATE OR REPLACE FUNCTION check_admin_user()
RETURNS TABLE(
    user_id UUID,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    role_name TEXT,
    status TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        au.email,
        u.first_name,
        u.last_name,
        r.name as role_name,
        u.status
    FROM users u
    JOIN roles r ON u.role_id = r.id
    LEFT JOIN auth.users au ON u.id = au.id
    WHERE r.name = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to list all users (for debugging)
CREATE OR REPLACE FUNCTION list_all_users()
RETURNS TABLE(
    user_id UUID,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    role_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        COALESCE(au.email, 'No email') as email,
        u.first_name,
        u.last_name,
        r.name as role_name,
        u.created_at
    FROM users u
    JOIN roles r ON u.role_id = r.id
    LEFT JOIN auth.users au ON u.id = au.id
    ORDER BY u.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- EXECUTE ONE OF THE METHODS
-- ===========================================

-- Try Method 1: Create admin user directly
-- SELECT create_admin_user_direct();

-- Or Method 2: Create temporary admin user for testing
-- SELECT create_temp_admin_user();

-- Then verify it worked
-- SELECT * FROM check_admin_user();

-- List all users to see what we have
-- SELECT * FROM list_all_users();
