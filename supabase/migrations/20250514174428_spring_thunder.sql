/*
  # Fix profiles RLS policies

  1. Changes
    - Remove problematic RLS policies that were causing infinite recursion
    - Add simplified policies for profile management
    
  2. Security
    - Enable RLS on profiles table (already enabled)
    - Add policy for admins to manage all profiles
    - Add policy for users to manage their own profiles
    - Add policy for users to view their own profile and admins to view all profiles
*/

-- Drop existing policies to replace them with fixed versions
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Enable insert for new users" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

-- Create new, simplified policies
CREATE POLICY "Admins can manage all profiles"
ON profiles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles admin_profile
    WHERE admin_profile.id = auth.uid() 
    AND admin_profile.role = 'admin'
  )
);

CREATE POLICY "Users can manage own profile"
ON profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (
  id = auth.uid() 
  AND (
    CASE 
      WHEN role IS NOT NULL THEN role = (SELECT role FROM profiles WHERE id = auth.uid())
      ELSE true
    END
  )
);

CREATE POLICY "Users can view profiles"
ON profiles
FOR SELECT
TO authenticated
USING (
  id = auth.uid() 
  OR 
  EXISTS (
    SELECT 1 FROM profiles admin_profile
    WHERE admin_profile.id = auth.uid() 
    AND admin_profile.role = 'admin'
  )
);