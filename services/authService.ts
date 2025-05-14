import { User, UserRole } from '@/context/AuthContext';

// Mock user data for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?img=68',
  },
  {
    id: '2',
    name: 'John Employee',
    email: 'employee@example.com',
    role: 'employee',
    department: 'Engineering',
    position: 'Software Developer',
    avatar: 'https://i.pravatar.cc/150?img=33',
  },
];

// Simulate API login
export const loginApi = async (email: string, password: string): Promise<User> => {
  // Simulate network request
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // For demo, allow any password for these emails
  const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    throw new Error('Invalid email or password');
  }

  return user;
};

// Simulate API registration
export const registerApi = async (
  name: string,
  email: string,
  password: string,
  role: UserRole
): Promise<User> => {
  // Simulate network request
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Check if user already exists
  const existingUser = mockUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Create new user
  const newUser: User = {
    id: String(mockUsers.length + 1),
    name,
    email,
    role,
    avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
  };

  mockUsers.push(newUser);
  return newUser;
};