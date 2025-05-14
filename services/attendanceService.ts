import { format, subDays, parseISO, addDays } from 'date-fns';

export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  clockInTime: string;
  clockOutTime: string | null;
  clockInLocation: Location;
  clockOutLocation: Location | null;
  totalHours: number | null;
  status: 'present' | 'absent' | 'late' | 'half-day';
  notes: string | null;
}

// Generate mock attendance data for the past 30 days
const generateMockAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const employeeIds = ['2', '3', '4', '5'];
  const employeeNames = ['John Doe', 'Jane Smith', 'Michael Johnson', 'Emily Davis'];
  
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = subDays(today, i);
    const dateString = format(date, 'yyyy-MM-dd');
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    employeeIds.forEach((empId, index) => {
      // Some randomization for more realistic data
      const isPresent = Math.random() > 0.1; // 10% chance of absence
      const isLate = isPresent && Math.random() > 0.8; // 20% chance of being late
      const isHalfDay = isPresent && !isLate && Math.random() > 0.9; // 10% chance of half day
      
      if (!isPresent) {
        // Absent record
        records.push({
          id: `${dateString}-${empId}`,
          employeeId: empId,
          employeeName: employeeNames[index],
          date: dateString,
          clockInTime: null as any,
          clockOutTime: null,
          clockInLocation: null as any,
          clockOutLocation: null,
          totalHours: 0,
          status: 'absent',
          notes: Math.random() > 0.7 ? 'Sick leave' : null,
        });
      } else {
        // Base clock in time between 8:30 and 9:00
        let clockInHour = 8;
        let clockInMinute = Math.floor(Math.random() * 30) + 30;
        
        // If late, adjust clock in time to be after 9:00
        if (isLate) {
          clockInHour = 9;
          clockInMinute = Math.floor(Math.random() * 45) + 15;
        }
        
        const clockInTimeString = `${clockInHour.toString().padStart(2, '0')}:${clockInMinute.toString().padStart(2, '0')}`;
        
        // Clock out time between 17:00 and 18:30
        let clockOutHour = 17;
        let clockOutMinute = Math.floor(Math.random() * 90);
        
        // If half day, adjust clock out time to be around 13:00
        if (isHalfDay) {
          clockOutHour = 13;
          clockOutMinute = Math.floor(Math.random() * 30);
        }
        
        const clockOutTimeString = `${clockOutHour.toString().padStart(2, '0')}:${clockOutMinute.toString().padStart(2, '0')}`;
        
        // Calculate total hours
        const totalHours = (clockOutHour + clockOutMinute / 60) - (clockInHour + clockInMinute / 60);
        
        let status: 'present' | 'late' | 'half-day' = 'present';
        if (isLate) status = 'late';
        if (isHalfDay) status = 'half-day';
        
        records.push({
          id: `${dateString}-${empId}`,
          employeeId: empId,
          employeeName: employeeNames[index],
          date: dateString,
          clockInTime: clockInTimeString,
          clockOutTime: clockOutTimeString,
          clockInLocation: {
            latitude: 40.7128 + (Math.random() * 0.01 - 0.005),
            longitude: -74.006 + (Math.random() * 0.01 - 0.005),
            accuracy: Math.random() * 20 + 5,
            timestamp: date.getTime() + (clockInHour * 3600000) + (clockInMinute * 60000),
          },
          clockOutLocation: {
            latitude: 40.7128 + (Math.random() * 0.01 - 0.005),
            longitude: -74.006 + (Math.random() * 0.01 - 0.005),
            accuracy: Math.random() * 20 + 5,
            timestamp: date.getTime() + (clockOutHour * 3600000) + (clockOutMinute * 60000),
          },
          totalHours: parseFloat(totalHours.toFixed(2)),
          status,
          notes: null,
        });
      }
    });
  }
  
  return records;
};

// Mock attendance records
let mockAttendanceRecords = generateMockAttendance();

// Get all attendance records
export const getAllAttendanceRecords = async (): Promise<AttendanceRecord[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return [...mockAttendanceRecords];
};

// Get attendance records for a specific employee
export const getEmployeeAttendance = async (employeeId: string): Promise<AttendanceRecord[]> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return mockAttendanceRecords.filter((record) => record.employeeId === employeeId);
};

// Get attendance records for a specific date
export const getAttendanceByDate = async (date: string): Promise<AttendanceRecord[]> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return mockAttendanceRecords.filter((record) => record.date === date);
};

// Add a new attendance record (clock in)
export const clockIn = async (
  employeeId: string,
  employeeName: string,
  location: Location
): Promise<AttendanceRecord> => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  
  const date = format(new Date(), 'yyyy-MM-dd');
  const time = format(new Date(), 'HH:mm');
  
  // Check if already clocked in today
  const existingRecord = mockAttendanceRecords.find(
    (record) => record.employeeId === employeeId && record.date === date
  );
  
  if (existingRecord && existingRecord.clockInTime) {
    throw new Error('Already clocked in today');
  }
  
  const newRecord: AttendanceRecord = {
    id: `${date}-${employeeId}`,
    employeeId,
    employeeName,
    date,
    clockInTime: time,
    clockOutTime: null,
    clockInLocation: location,
    clockOutLocation: null,
    totalHours: null,
    status: 'present',
    notes: null,
  };
  
  if (existingRecord) {
    // Update existing record
    const index = mockAttendanceRecords.findIndex((r) => r.id === existingRecord.id);
    mockAttendanceRecords[index] = newRecord;
  } else {
    // Add new record
    mockAttendanceRecords.push(newRecord);
  }
  
  return newRecord;
};

// Update an attendance record (clock out)
export const clockOut = async (
  employeeId: string,
  location: Location
): Promise<AttendanceRecord> => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  
  const date = format(new Date(), 'yyyy-MM-dd');
  const time = format(new Date(), 'HH:mm');
  
  // Find existing record
  const existingRecordIndex = mockAttendanceRecords.findIndex(
    (record) => record.employeeId === employeeId && record.date === date
  );
  
  if (existingRecordIndex === -1 || !mockAttendanceRecords[existingRecordIndex].clockInTime) {
    throw new Error('No clock-in record found for today');
  }
  
  if (mockAttendanceRecords[existingRecordIndex].clockOutTime) {
    throw new Error('Already clocked out today');
  }
  
  // Calculate hours worked
  const clockInTimeParts = mockAttendanceRecords[existingRecordIndex].clockInTime.split(':');
  const clockInHours = parseInt(clockInTimeParts[0], 10);
  const clockInMinutes = parseInt(clockInTimeParts[1], 10);
  
  const clockOutTimeParts = time.split(':');
  const clockOutHours = parseInt(clockOutTimeParts[0], 10);
  const clockOutMinutes = parseInt(clockOutTimeParts[1], 10);
  
  const totalHours = parseFloat(
    (
      (clockOutHours + clockOutMinutes / 60) -
      (clockInHours + clockInMinutes / 60)
    ).toFixed(2)
  );
  
  // Determine status based on hours worked and clock-in time
  let status: 'present' | 'late' | 'half-day' = 'present';
  
  if (totalHours < 4) {
    status = 'half-day';
  } else if (clockInHours >= 9 && clockInMinutes > 15) {
    status = 'late';
  }
  
  // Update record
  const updatedRecord: AttendanceRecord = {
    ...mockAttendanceRecords[existingRecordIndex],
    clockOutTime: time,
    clockOutLocation: location,
    totalHours,
    status,
  };
  
  mockAttendanceRecords[existingRecordIndex] = updatedRecord;
  
  return updatedRecord;
};

// Get attendance summary for a date range
export interface AttendanceSummary {
  employeeId: string;
  employeeName: string;
  totalDays: number;
  present: number;
  absent: number;
  late: number;
  halfDay: number;
  totalHours: number;
}

export const getAttendanceSummary = async (
  startDate: string,
  endDate: string,
  employeeId?: string
): Promise<AttendanceSummary[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Get records within date range
  let filteredRecords = mockAttendanceRecords.filter(
    (record) => record.date >= startDate && record.date <= endDate
  );
  
  // Filter by employee if specified
  if (employeeId) {
    filteredRecords = filteredRecords.filter((record) => record.employeeId === employeeId);
  }
  
  // Group by employee
  const employeeMap = new Map<string, AttendanceSummary>();
  
  filteredRecords.forEach((record) => {
    if (!employeeMap.has(record.employeeId)) {
      employeeMap.set(record.employeeId, {
        employeeId: record.employeeId,
        employeeName: record.employeeName,
        totalDays: 0,
        present: 0,
        absent: 0,
        late: 0,
        halfDay: 0,
        totalHours: 0,
      });
    }
    
    const summary = employeeMap.get(record.employeeId)!;
    summary.totalDays++;
    
    switch (record.status) {
      case 'present':
        summary.present++;
        break;
      case 'absent':
        summary.absent++;
        break;
      case 'late':
        summary.late++;
        break;
      case 'half-day':
        summary.halfDay++;
        break;
    }
    
    summary.totalHours += record.totalHours || 0;
    summary.totalHours = parseFloat(summary.totalHours.toFixed(2));
  });
  
  return Array.from(employeeMap.values());
};