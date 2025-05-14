/*
  # Fix profiles table RLS policies

  1. Changes
    - Drop existing problematic policies
    - Create new simplified policies without NEW/OLD references
    - Implement proper role-based access control
    
  2. Security
    - Admins have full access to all profiles
    - Users can view all profiles
    - Users can only update their own profile (except role)
*/

-- Drop existing policies to replace them with optimized versions
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can manage own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view profiles" ON profiles;

-- Create new, optimized policies
CREATE POLICY "admins_manage_all_profiles"
ON profiles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.jwt() WHERE (jwt ->> 'role')::text = 'admin'
  )
);

CREATE POLICY "users_manage_own_profile"
ON profiles
FOR UPDATE
TO authenticated
USING (
  auth.uid() = id
)
WITH CHECK (
  auth.uid() = id AND
  role = (SELECT role FROM profiles WHERE id = auth.uid())
);

CREATE POLICY "users_view_all_profiles"
ON profiles
FOR SELECT
TO authenticated
USING (true);