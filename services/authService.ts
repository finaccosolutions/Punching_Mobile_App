import { createClient } from '@supabase/supabase-js';
import { User, UserRole } from '@/context/AuthContext';

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);

// Login user
export const loginApi = async (email: string, password: string): Promise<User> => {
  const { data: { user }, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!user) {
    throw new Error('User not found');
  }

  // Get additional user data from profiles table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError) {
    throw new Error('Failed to fetch user profile');
  }

  return {
    id: user.id,
    email: user.email!,
    name: profile.full_name,
    role: profile.role as UserRole,
    department: profile.department,
    position: profile.position,
    avatar: profile.avatar_url
  };
};

// Register new employee (admin only)
export const registerEmployee = async (
  adminId: string,
  employeeData: {
    email: string;
    name: string;
    department: string;
    position: string;
    salary: number;
  }
): Promise<User> => {
  // First check if the admin has permission
  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', adminId)
    .single();

  if (!adminProfile || adminProfile.role !== 'admin') {
    throw new Error('Unauthorized: Only admins can register employees');
  }

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
      created_by: adminId
    });

  if (profileError) {
    // Rollback auth user creation if profile creation fails
    await supabase.auth.admin.deleteUser(user.id);
    throw new Error('Failed to create employee profile');
  }

  return {
    id: user.id,
    email: user.email!,
    name: employeeData.name,
    role: 'employee',
    department: employeeData.department,
    position: employeeData.position
  };
};

// Update user profile (limited fields for employees)
export const updateProfile = async (
  userId: string,
  updates: {
    name?: string;
    avatar?: string;
  }
): Promise<void> => {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) {
    throw new Error('Failed to update profile');
  }
};

// Change password
export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) {
    throw new Error('Failed to update password');
  }
};