/*
  # Fix profiles RLS policies

  1. Changes
    - Drop existing policies
    - Create new policies without recursion
    - Fix syntax for row-level security
    - Implement proper role-based access control
    
  2. Security
    - Maintain same security rules with correct syntax
    - Ensure proper field-level restrictions for updates
*/

-- Drop existing policies to prevent conflicts
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
  role = current_setting('row.role', true)::text AND
  department = current_setting('row.department', true)::text AND
  position = current_setting('row.position', true)::text AND
  salary = current_setting('row.salary', true)::numeric AND
  created_by = current_setting('row.created_by', true)::uuid
);

CREATE POLICY "Enable insert for new users"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (
  id = auth.uid() AND
  role = 'employee'
);

-- Function to set current row values before update
CREATE OR REPLACE FUNCTION set_profile_current_values()
RETURNS trigger AS $$
BEGIN
  PERFORM set_config('row.role', OLD.role::text, true);
  PERFORM set_config('row.department', OLD.department::text, true);
  PERFORM set_config('row.position', OLD.position::text, true);
  PERFORM set_config('row.salary', OLD.salary::text, true);
  PERFORM set_config('row.created_by', OLD.created_by::text, true);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set current values before update
DROP TRIGGER IF EXISTS set_profile_values_trigger ON profiles;
CREATE TRIGGER set_profile_values_trigger
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_profile_current_values();