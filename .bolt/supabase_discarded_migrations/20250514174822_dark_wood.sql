/*
  # Fix profiles table RLS policies

  1. Changes
    - Remove existing RLS policies that cause infinite recursion
    - Add new, optimized RLS policies for the profiles table
      - Allow admins to manage all profiles
      - Allow users to manage their own profile
      - Allow users to view all profiles
    
  2. Security
    - Maintains RLS protection while preventing infinite recursion
    - Simplifies policy logic for better performance
    - Uses JWT claims for role checking instead of recursive queries
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
  (auth.jwt() ->> 'role')::text = 'admin'
)
WITH CHECK (
  (auth.jwt() ->> 'role')::text = 'admin'
);

CREATE POLICY "users_manage_own_profile"
ON profiles
FOR ALL
TO authenticated
USING (
  auth.uid() = id
)
WITH CHECK (
  auth.uid() = id AND
  (
    -- Allow users to update everything except role
    COALESCE(NEW.role, role) = role
  )
);

CREATE POLICY "users_view_all_profiles"
ON profiles
FOR SELECT
TO authenticated
USING (true);