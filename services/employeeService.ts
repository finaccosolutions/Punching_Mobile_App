import { createClient } from '@supabase/supabase-js';
import * as crypto from 'crypto';

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);

interface CreateEmployeeData {
  email: string;
  username: string;
  password: string;
  name: string;
  department: string;
  position: string;
  salary: number;
  phoneNumber: string;
  joiningDate: string;
  address?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  department?: string;
  position?: string;
  avatar_url?: string;
  phone_number?: string;
}

// Hash password using SHA-256
const hashPassword = (password: string): string => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Get all employees
export const getAllEmployees = async (): Promise<Employee[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name as name, email, department, position, avatar_url, phone_number')
    .eq('role', 'employee');

  if (error) {
    throw new Error('Failed to fetch employees');
  }

  return data || [];
};

// Create new employee (admin only)
export const createEmployee = async (employeeData: CreateEmployeeData) => {
  try {
    // Start a transaction
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        full_name: employeeData.name,
        role: 'employee',
        department: employeeData.department,
        position: employeeData.position,
        salary: employeeData.salary,
        phone_number: employeeData.phoneNumber,
        joining_date: employeeData.joiningDate,
        address: employeeData.address,
        email: employeeData.email
      })
      .select()
      .single();

    if (profileError) {
      throw new Error('Failed to create employee profile');
    }

    // Create employee credentials
    const { error: credentialsError } = await supabase
      .from('employee_credentials')
      .insert({
        employee_id: profile.id,
        username: employeeData.username,
        password_hash: hashPassword(employeeData.password)
      });

    if (credentialsError) {
      // Rollback profile creation
      await supabase
        .from('profiles')
        .delete()
        .eq('id', profile.id);
      throw new Error('Failed to create employee credentials');
    }

    return {
      profile,
      username: employeeData.username,
      password: employeeData.password
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create employee: ${error.message}`);
    }
    throw new Error('Failed to create employee');
  }
};