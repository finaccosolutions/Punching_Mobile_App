import { User } from '@/context/AuthContext';

export interface Employee extends User {
  employeeId: string;
  department: string;
  position: string;
  salary: number;
  joiningDate: string;
  phoneNumber: string;
  address?: string;
  emergencyContact?: string;
}

// Mock employee data
const mockEmployees: Employee[] = [
  {
    id: '2',
    employeeId: 'EMP001',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'employee',
    department: 'Engineering',
    position: 'Software Developer',
    salary: 75000,
    joiningDate: '2022-03-15',
    phoneNumber: '+1 (555) 123-4567',
    address: '123 Main St, Anytown, USA',
    avatar: 'https://i.pravatar.cc/150?img=33',
  },
  {
    id: '3',
    employeeId: 'EMP002',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'employee',
    department: 'Marketing',
    position: 'Marketing Specialist',
    salary: 65000,
    joiningDate: '2021-08-10',
    phoneNumber: '+1 (555) 987-6543',
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: '4',
    employeeId: 'EMP003',
    name: 'Michael Johnson',
    email: 'michael@example.com',
    role: 'employee',
    department: 'Finance',
    position: 'Financial Analyst',
    salary: 70000,
    joiningDate: '2023-01-05',
    phoneNumber: '+1 (555) 456-7890',
    address: '789 Oak Ave, Somewhere, USA',
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: '5',
    employeeId: 'EMP004',
    name: 'Emily Davis',
    email: 'emily@example.com',
    role: 'employee',
    department: 'HR',
    position: 'HR Manager',
    salary: 80000,
    joiningDate: '2020-11-20',
    phoneNumber: '+1 (555) 234-5678',
    avatar: 'https://i.pravatar.cc/150?img=20',
  },
];

// Simulate fetching all employees
export const getAllEmployees = async (): Promise<Employee[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  return [...mockEmployees];
};

// Simulate fetching a single employee by ID
export const getEmployeeById = async (id: string): Promise<Employee | null> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockEmployees.find((emp) => emp.id === id) || null;
};

// Simulate adding a new employee
export const addEmployee = async (employee: Omit<Employee, 'id'>): Promise<Employee> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  const newEmployee: Employee = {
    ...employee,
    id: String(mockEmployees.length + 10),
  };
  
  mockEmployees.push(newEmployee);
  return newEmployee;
};

// Simulate updating an employee
export const updateEmployee = async (employee: Employee): Promise<Employee> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  const index = mockEmployees.findIndex((emp) => emp.id === employee.id);
  if (index === -1) {
    throw new Error('Employee not found');
  }
  
  mockEmployees[index] = employee;
  return employee;
};

// Simulate deleting an employee
export const deleteEmployee = async (id: string): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  const index = mockEmployees.findIndex((emp) => emp.id === id);
  if (index === -1) {
    return false;
  }
  
  mockEmployees.splice(index, 1);
  return true;
};

// Get departments (for filtering)
export const getDepartments = async (): Promise<string[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  const departments = new Set<string>();
  mockEmployees.forEach((emp) => departments.add(emp.department));
  
  return Array.from(departments);
};