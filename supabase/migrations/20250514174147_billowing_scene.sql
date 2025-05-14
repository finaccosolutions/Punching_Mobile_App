/*
  # Fix profiles RLS policies

  1. Changes
    - Remove recursive admin check in profiles policies
    - Implement proper role-based access control
    - Maintain security while preventing infinite recursion
  
  2. Security
    - Enable RLS on profiles table (already enabled)
    - Add policy for admin users based on JWT claims
    - Add policy for users to view their own profile
    - Add policy for users to update their own profile with restrictions
*/

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

-- Create new policies without recursion
CREATE POLICY "Admins can manage all profiles"
ON profiles
FOR ALL
TO authenticated
USING (
  (auth.jwt() ->> 'role')::text = 'admin'
)
WITH CHECK (
  (auth.jwt() ->> 'role')::text = 'admin'
);

CREATE POLICY "Users can view their own profile"
ON profiles
FOR SELECT
TO authenticated
USING (
  id = auth.uid()
);

CREATE POLICY "Users can update their own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (
  id = auth.uid()
)
WITH CHECK (
  id = auth.uid() AND
  (
    CASE WHEN auth.jwt() ->> 'role' = 'admin'
    THEN true
    ELSE
      -- Non-admin users can't modify sensitive fields
      (
        CASE 
          WHEN NEW.role IS DISTINCT FROM OLD.role THEN false
          WHEN NEW.salary IS DISTINCT FROM OLD.salary THEN false
          WHEN NEW.department IS DISTINCT FROM OLD.department THEN false
          WHEN NEW.position IS DISTINCT FROM OLD.position THEN false
          WHEN NEW.created_by IS DISTINCT FROM OLD.created_by THEN false
          ELSE true
        END
      )
    END
  )
);

CREATE POLICY "Enable insert for new users"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (
  id = auth.uid() AND
  role = 'employee'  -- New users can only be employees
);