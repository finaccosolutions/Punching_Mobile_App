/*
  # Add Employee Credentials Management

  1. Changes
    - Add employee_credentials table to store login information
    - Add relationship between profiles and credentials
    - Update RLS policies for secure access
    
  2. Security
    - Ensure credentials are stored securely
    - Only admins can create/update credentials
    - Employees can only view their own credentials
*/

-- Create employee_credentials table
CREATE TABLE IF NOT EXISTS employee_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES profiles(id) NOT NULL,
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- Enable RLS
ALTER TABLE employee_credentials ENABLE ROW LEVEL SECURITY;

-- Policies for employee_credentials
CREATE POLICY "Admins can manage credentials"
ON employee_credentials
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Employees can view own credentials"
ON employee_credentials
FOR SELECT
TO authenticated
USING (employee_id = auth.uid());

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating timestamp
CREATE TRIGGER update_employee_credentials_updated_at
    BEFORE UPDATE
    ON employee_credentials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();