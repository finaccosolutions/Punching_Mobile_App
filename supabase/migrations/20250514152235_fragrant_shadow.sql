/*
  # Initial Schema Setup

  1. New Tables
    - `attendance_records`
      - `id` (uuid, primary key)
      - `employee_id` (uuid, references auth.users)
      - `clock_in_time` (timestamptz)
      - `clock_out_time` (timestamptz)
      - `clock_in_location` (jsonb)
      - `clock_out_location` (jsonb)
      - `status` (text)
      - `total_hours` (numeric)
      - `created_at` (timestamptz)
    
    - `payroll_records`
      - `id` (uuid, primary key)
      - `employee_id` (uuid, references auth.users)
      - `period` (text)
      - `base_salary` (numeric)
      - `overtime_pay` (numeric)
      - `deductions` (numeric)
      - `net_salary` (numeric)
      - `status` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Policies to ensure users can only access their own data
    - Admin users can access all records
*/

-- Create attendance records table
CREATE TABLE IF NOT EXISTS attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES auth.users(id) NOT NULL,
  clock_in_time timestamptz,
  clock_out_time timestamptz,
  clock_in_location jsonb,
  clock_out_location jsonb,
  status text NOT NULL,
  total_hours numeric,
  created_at timestamptz DEFAULT now()
);

-- Create payroll records table
CREATE TABLE IF NOT EXISTS payroll_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES auth.users(id) NOT NULL,
  period text NOT NULL,
  base_salary numeric NOT NULL,
  overtime_pay numeric DEFAULT 0,
  deductions numeric DEFAULT 0,
  net_salary numeric NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_records ENABLE ROW LEVEL SECURITY;

-- Policies for attendance_records
CREATE POLICY "Users can view their own attendance"
  ON attendance_records
  FOR SELECT
  TO authenticated
  USING (auth.uid() = employee_id OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can insert their own attendance"
  ON attendance_records
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = employee_id);

CREATE POLICY "Users can update their own attendance"
  ON attendance_records
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = employee_id OR auth.jwt() ->> 'role' = 'admin');

-- Policies for payroll_records
CREATE POLICY "Users can view their own payroll"
  ON payroll_records
  FOR SELECT
  TO authenticated
  USING (auth.uid() = employee_id OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can manage payroll"
  ON payroll_records
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');