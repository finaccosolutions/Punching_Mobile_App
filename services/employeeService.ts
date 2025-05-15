import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);

interface CreateEmployeeData {
  email: string;
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
  // Generate a temporary password
  const tempPassword = Math.random().toString(36).slice(-8);

  // Create auth user
  const { data: { user }, error: authError } = await supabase.auth.admin.createUser({
    email: employeeData.email,
    password: tempPassword,
    email_confirm: true
  });

  if (authError) {
    throw new Error(authError.message);
  }

  if (!user) {
    throw new Error('Failed to create user');
  }

  // Create user profile
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      full_name: employeeData.name,
      role: 'employee',
      department: employeeData.department,
      position: employeeData.position,
      salary: employeeData.salary,
      phone_number: employeeData.phoneNumber,
      joining_date: employeeData.joiningDate,
      address: employeeData.address,
    });

  if (profileError) {
    // Rollback auth user creation if profile creation fails
    await supabase.auth.admin.deleteUser(user.id);
    throw new Error('Failed to create employee profile');
  }

  return {
    ...user,
    tempPassword,
  };
};