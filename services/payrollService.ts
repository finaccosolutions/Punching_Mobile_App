import { format, subMonths, getDaysInMonth, parseISO } from 'date-fns';
import { Employee } from './employeeService';
import { getAttendanceSummary, AttendanceSummary } from './attendanceService';

export interface PayrollItem {
  id: string;
  employeeId: string;
  employeeName: string;
  period: string; // "MM-YYYY"
  baseSalary: number;
  overtimePay: number;
  bonuses: number;
  deductions: number;
  taxes: number;
  netSalary: number;
  status: 'pending' | 'processed' | 'paid';
  createdAt: string;
  paidAt: string | null;
  attendanceSummary: {
    workingDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    halfDays: number;
    totalHours: number;
  };
}

// Mock payroll data generator
const generateMockPayroll = async (): Promise<PayrollItem[]> => {
  const payrollItems: PayrollItem[] = [];
  const employeeIds = ['2', '3', '4', '5'];
  const employeeNames = ['John Doe', 'Jane Smith', 'Michael Johnson', 'Emily Davis'];
  const baseSalaries = [75000, 65000, 70000, 80000]; // Annual salaries
  
  const today = new Date();
  
  // Generate payroll for the last 6 months
  for (let i = 0; i < 6; i++) {
    const month = subMonths(today, i);
    const period = format(month, 'MM-yyyy');
    const daysInMonth = getDaysInMonth(month);
    const workingDays = 22; // Approximation of working days in a month
    
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const startDate = format(new Date(year, monthIndex, 1), 'yyyy-MM-dd');
    const endDate = format(new Date(year, monthIndex, daysInMonth), 'yyyy-MM-dd');
    
    for (let j = 0; j < employeeIds.length; j++) {
      // Get attendance summary for this employee in this month
      const attendanceSummaries = await getAttendanceSummary(startDate, endDate, employeeIds[j]);
      const attendanceSummary = attendanceSummaries.length > 0 ? attendanceSummaries[0] : {
        totalDays: workingDays,
        present: workingDays,
        absent: 0,
        late: 0,
        halfDay: 0,
        totalHours: workingDays * 8,
      };
      
      // Calculate monthly base salary
      const monthlySalary = baseSalaries[j] / 12;
      
      // Calculate deductions based on attendance
      const dailyRate = monthlySalary / workingDays;
      const absentDeduction = attendanceSummary.absent * dailyRate;
      const halfDayDeduction = attendanceSummary.halfDay * (dailyRate / 2);
      const lateDeduction = attendanceSummary.late * (dailyRate * 0.1); // 10% penalty for late
      
      // Calculate overtime (if any)
      const regularHours = workingDays * 8;
      const overtimeHours = Math.max(0, attendanceSummary.totalHours - regularHours);
      const overtimeRate = dailyRate / 8 * 1.5; // 1.5x regular hourly rate
      const overtimePay = overtimeHours * overtimeRate;
      
      // Apply some random bonuses
      const bonus = Math.random() > 0.7 ? Math.round(monthlySalary * Math.random() * 0.1) : 0;
      
      // Calculate taxes (assuming a 20% tax rate)
      const taxableIncome = monthlySalary + overtimePay + bonus;
      const taxes = taxableIncome * 0.2;
      
      // Calculate total deductions
      const totalDeductions = absentDeduction + halfDayDeduction + lateDeduction;
      
      // Calculate net salary
      const netSalary = monthlySalary + overtimePay + bonus - totalDeductions - taxes;
      
      // Determine status based on month
      let status: 'pending' | 'processed' | 'paid' = 'paid';
      if (i === 0) {
        status = 'pending';
      } else if (i === 1 && Math.random() > 0.5) {
        status = 'processed';
      }
      
      // Create payroll item
      payrollItems.push({
        id: `${period}-${employeeIds[j]}`,
        employeeId: employeeIds[j],
        employeeName: employeeNames[j],
        period,
        baseSalary: parseFloat(monthlySalary.toFixed(2)),
        overtimePay: parseFloat(overtimePay.toFixed(2)),
        bonuses: bonus,
        deductions: parseFloat(totalDeductions.toFixed(2)),
        taxes: parseFloat(taxes.toFixed(2)),
        netSalary: parseFloat(netSalary.toFixed(2)),
        status,
        createdAt: format(subMonths(today, i - 1), 'yyyy-MM-dd'),
        paidAt: status === 'paid' ? format(subMonths(today, i - 1), 'yyyy-MM-dd') : null,
        attendanceSummary: {
          workingDays,
          presentDays: attendanceSummary.present,
          absentDays: attendanceSummary.absent,
          lateDays: attendanceSummary.late,
          halfDays: attendanceSummary.halfDay,
          totalHours: attendanceSummary.totalHours,
        },
      });
    }
  }
  
  return payrollItems;
};

// Initialize mock payroll items
let mockPayrollItems: PayrollItem[] = [];

// Get all payroll items
export const getAllPayrollItems = async (): Promise<PayrollItem[]> => {
  // Generate mock data if not already generated
  if (mockPayrollItems.length === 0) {
    mockPayrollItems = await generateMockPayroll();
  }
  
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return [...mockPayrollItems];
};

// Get payroll for a specific employee
export const getEmployeePayroll = async (employeeId: string): Promise<PayrollItem[]> => {
  // Generate mock data if not already generated
  if (mockPayrollItems.length === 0) {
    mockPayrollItems = await generateMockPayroll();
  }
  
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  return mockPayrollItems.filter((item) => item.employeeId === employeeId);
};

// Get payroll for a specific period
export const getPayrollByPeriod = async (period: string): Promise<PayrollItem[]> => {
  // Generate mock data if not already generated
  if (mockPayrollItems.length === 0) {
    mockPayrollItems = await generateMockPayroll();
  }
  
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  return mockPayrollItems.filter((item) => item.period === period);
};

// Generate payroll for a specific period
export const generatePayroll = async (
  period: string,
  employees: Employee[]
): Promise<PayrollItem[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  const [month, year] = period.split('-');
  const monthIndex = parseInt(month, 10) - 1;
  const yearNum = parseInt(year, 10);
  
  const startDate = format(new Date(yearNum, monthIndex, 1), 'yyyy-MM-dd');
  const endDate = format(new Date(yearNum, monthIndex + 1, 0), 'yyyy-MM-dd');
  const workingDays = 22; // Approximation
  
  const newPayrollItems: PayrollItem[] = [];
  
  // Get attendance data for all employees in the period
  for (const employee of employees) {
    // Skip if payroll already exists for this employee and period
    if (mockPayrollItems.some((item) => 
      item.employeeId === employee.id && item.period === period
    )) {
      continue;
    }
    
    // Get attendance summary
    const attendanceSummaries = await getAttendanceSummary(startDate, endDate, employee.id);
    const attendanceSummary = attendanceSummaries.length > 0 ? attendanceSummaries[0] : {
      totalDays: workingDays,
      present: workingDays,
      absent: 0,
      late: 0,
      halfDay: 0,
      totalHours: workingDays * 8,
    };
    
    // Calculate monthly base salary
    const monthlySalary = employee.salary / 12;
    
    // Calculate deductions based on attendance
    const dailyRate = monthlySalary / workingDays;
    const absentDeduction = attendanceSummary.absent * dailyRate;
    const halfDayDeduction = attendanceSummary.halfDay * (dailyRate / 2);
    const lateDeduction = attendanceSummary.late * (dailyRate * 0.1); // 10% penalty for late
    
    // Calculate overtime (if any)
    const regularHours = workingDays * 8;
    const overtimeHours = Math.max(0, attendanceSummary.totalHours - regularHours);
    const overtimeRate = dailyRate / 8 * 1.5; // 1.5x regular hourly rate
    const overtimePay = overtimeHours * overtimeRate;
    
    // No bonuses for newly generated payroll
    const bonus = 0;
    
    // Calculate taxes (assuming a 20% tax rate)
    const taxableIncome = monthlySalary + overtimePay + bonus;
    const taxes = taxableIncome * 0.2;
    
    // Calculate total deductions
    const totalDeductions = absentDeduction + halfDayDeduction + lateDeduction;
    
    // Calculate net salary
    const netSalary = monthlySalary + overtimePay + bonus - totalDeductions - taxes;
    
    // Create payroll item
    const newPayrollItem: PayrollItem = {
      id: `${period}-${employee.id}`,
      employeeId: employee.id,
      employeeName: employee.name,
      period,
      baseSalary: parseFloat(monthlySalary.toFixed(2)),
      overtimePay: parseFloat(overtimePay.toFixed(2)),
      bonuses: bonus,
      deductions: parseFloat(totalDeductions.toFixed(2)),
      taxes: parseFloat(taxes.toFixed(2)),
      netSalary: parseFloat(netSalary.toFixed(2)),
      status: 'pending',
      createdAt: format(new Date(), 'yyyy-MM-dd'),
      paidAt: null,
      attendanceSummary: {
        workingDays,
        presentDays: attendanceSummary.present,
        absentDays: attendanceSummary.absent,
        lateDays: attendanceSummary.late,
        halfDays: attendanceSummary.halfDay,
        totalHours: attendanceSummary.totalHours,
      },
    };
    
    newPayrollItems.push(newPayrollItem);
    mockPayrollItems.push(newPayrollItem);
  }
  
  return newPayrollItems;
};

// Update payroll status
export const updatePayrollStatus = async (
  payrollId: string,
  status: 'pending' | 'processed' | 'paid'
): Promise<PayrollItem> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  const payrollIndex = mockPayrollItems.findIndex((item) => item.id === payrollId);
  
  if (payrollIndex === -1) {
    throw new Error('Payroll item not found');
  }
  
  mockPayrollItems[payrollIndex] = {
    ...mockPayrollItems[payrollIndex],
    status,
    paidAt: status === 'paid' ? format(new Date(), 'yyyy-MM-dd') : mockPayrollItems[payrollIndex].paidAt,
  };
  
  return mockPayrollItems[payrollIndex];
};