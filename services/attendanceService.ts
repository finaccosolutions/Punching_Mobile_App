import { createClient } from '@supabase/supabase-js';
import { format } from 'date-fns';

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);

export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  clock_in_time: string | null;
  clock_out_time: string | null;
  clock_in_location: Location | null;
  clock_out_location: Location | null;
  status: 'present' | 'absent' | 'late' | 'half-day';
  total_hours: number | null;
  created_at: string;
}

// Get attendance records for the logged-in user
export const getEmployeeAttendance = async (userId: string): Promise<AttendanceRecord[]> => {
  const { data, error } = await supabase
    .from('attendance_records')
    .select('*')
    .eq('employee_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Clock in
export const clockIn = async (
  userId: string,
  location: Location
): Promise<AttendanceRecord> => {
  const now = new Date();
  const today = format(now, 'yyyy-MM-dd');

  // Check if already clocked in today
  const { data: existing } = await supabase
    .from('attendance_records')
    .select('*')
    .eq('employee_id', userId)
    .gte('created_at', today)
    .lt('created_at', format(now.setDate(now.getDate() + 1), 'yyyy-MM-dd'))
    .single();

  if (existing?.clock_in_time) {
    throw new Error('Already clocked in today');
  }

  const record = {
    employee_id: userId,
    clock_in_time: new Date().toISOString(),
    clock_in_location: location,
    status: 'present',
  };

  const { data, error } = await supabase
    .from('attendance_records')
    .insert(record)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Clock out
export const clockOut = async (
  userId: string,
  location: Location
): Promise<AttendanceRecord> => {
  const now = new Date();
  const today = format(now, 'yyyy-MM-dd');

  // Get today's record
  const { data: existing } = await supabase
    .from('attendance_records')
    .select('*')
    .eq('employee_id', userId)
    .gte('created_at', today)
    .lt('created_at', format(now.setDate(now.getDate() + 1), 'yyyy-MM-dd'))
    .single();

  if (!existing) {
    throw new Error('No clock-in record found for today');
  }

  if (existing.clock_out_time) {
    throw new Error('Already clocked out today');
  }

  // Calculate hours worked
  const clockInTime = new Date(existing.clock_in_time);
  const clockOutTime = new Date();
  const totalHours = (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);

  const { data, error } = await supabase
    .from('attendance_records')
    .update({
      clock_out_time: clockOutTime.toISOString(),
      clock_out_location: location,
      total_hours: parseFloat(totalHours.toFixed(2)),
    })
    .eq('id', existing.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};