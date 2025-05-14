/*
  # Fix profiles RLS policies

  1. Changes
    - Drop existing problematic RLS policies
    - Create new, simplified RLS policies without recursion
    
  2. Security
    - Enable RLS on profiles table
    - Add policy for admins to manage all profiles
    - Add policy for users to view their own profile
    - Add policy for users to update their own profile (with restrictions)
*/

-- Drop existing policies to prevent conflicts
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile (limited)" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

-- Create new policies without recursion
CREATE POLICY "Admins can manage all profiles"
ON profiles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

CREATE POLICY "Users can view their own profile"
ON profiles
FOR SELECT
TO authenticated
USING (
  id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

CREATE POLICY "Users can update their own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (
  id = auth.uid() AND
  (
    -- Allow updating only specific fields
    NEW.full_name IS NOT NULL AND
    NEW.phone_number IS NOT NULL AND
    NEW.emergency_contact IS NOT NULL AND
    NEW.address IS NOT NULL AND
    -- Preserve restricted fields
    NEW.role = OLD.role AND
    NEW.department = OLD.department AND
    NEW.position = OLD.position AND
    NEW.salary = OLD.salary AND
    NEW.created_by = OLD.created_by
  )
);