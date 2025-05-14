/*
  # Create admin user

  1. Changes
    - Create admin user with email admin@punchpro.com
    - Create corresponding profile with admin role
    
  2. Security
    - User will be created with email confirmation disabled
    - Profile will have admin role with full access
*/

-- Create admin user in auth.users
DO $$
DECLARE
  admin_uid uuid;
BEGIN
  -- Insert into auth.users table
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@punchpro.com',
    crypt('admin123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  )
  RETURNING id INTO admin_uid;

  -- Create admin profile
  INSERT INTO profiles (
    id,
    full_name,
    role,
    department,
    position,
    created_at
  )
  VALUES (
    admin_uid,
    'System Administrator',
    'admin',
    'Administration',
    'System Administrator',
    NOW()
  );
END $$;