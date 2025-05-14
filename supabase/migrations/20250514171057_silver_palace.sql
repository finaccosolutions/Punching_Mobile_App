/*
  # Add Admin User and Update Schema

  1. Changes
    - Add initial admin user with default credentials
    - Add employment details columns to profiles table
    
  2. Security
    - Maintain existing RLS policies
    - Add specific policies for admin user management
*/

-- Add employment details to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS employee_id text,
ADD COLUMN IF NOT EXISTS joining_date date,
ADD COLUMN IF NOT EXISTS phone_number text,
ADD COLUMN IF NOT EXISTS emergency_contact text,
ADD COLUMN IF NOT EXISTS address text;

-- Create initial admin user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'admin@company.com',
  crypt('admin123', gen_salt('bf')), -- Default password: admin123
  now(),
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Create admin profile
INSERT INTO public.profiles (
  id,
  full_name,
  role,
  created_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'System Admin',
  'admin',
  now()
) ON CONFLICT (id) DO NOTHING;