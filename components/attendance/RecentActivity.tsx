import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Card from '@/components/ui/Card';
import { getEmployeeAttendance, AttendanceRecord } from '@/services/attendanceService';
import { ClipboardList, Clock, MapPin } from 'lucide-react-native';
import { format, parseISO } from 'date-fns';

interface RecentActivityProps {
  userId: string | undefined;
}

export default function RecentActivity({ userId }: RecentActivityProps) {
  const { colors } = useTheme();
  
  const [isLoading, setIsLoading] = useState(true);
  const [recentRecords, setRecentRecords] = useState<AttendanceRecord[]>([]);
  
  useEffect(() => {
    const fetchRecentActivity = async () => {
      if (!userId) return;
      
      try {
        setIsLoading(true);
        const records = await getEmployeeAttendance(userId);
        
        // Sort by date descending and take the 5 most recent
        const sortedRecords = records
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);
          
        setRecentRecords(sortedRecords);
      } catch (error) {
        console.error('Error fetching recent activity:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecentActivity();
  }, [userId]);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return colors.success;
      case 'late':
        return colors.warning;
      case 'absent':
        return colors.error;
      case 'half-day':
        return colors.accent;
      default:
        return colors.textSecondary;
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'present':
        return 'Present';
      case 'late':
        return 'Late';
      case 'absent':
        return 'Absent';
      case 'half-day':
        return 'Half Day';
      default:
        return 'Unknown';
    }
  };
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };
  
  if (!userId) return null;
  
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <ClipboardList size={20} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text }]}>
          Recent Activity
        </Text>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : recentRecords.length === 0 ? (
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          No recent attendance records found.
        </Text>
      ) : (
        recentRecords.map((record) => (
          <View key={record.id} style={styles.recordItem}>
            <View style={styles.recordHeader}>
              <Text style={[styles.dateText, { color: colors.text }]}>
                {formatDate(record.date)}
              </Text>
              <View style={[
                styles.statusBadge, 
                { backgroundColor: getStatusColor(record.status) + '20' }
              ]}>
                <Text style={[
                  styles.statusText, 
                  { color: getStatusColor(record.status) }
                ]}>
                  {getStatusLabel(record.status)}
                </Text>
              </View>
            </View>
            
            <View style={styles.timeContainer}>
              {record.clockInTime && (
                <View style={styles.timeItem}>
                  <Clock size={16} color={colors.textSecondary} />
                  <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>
                    In:
                  </Text>
                  <Text style={[styles.timeValue, { color: colors.text }]}>
                    {record.clockInTime}
                  </Text>
                </View>
              )}
              
              {record.clockOutTime && (
                <View style={styles.timeItem}>
                  <Clock size={16} color={colors.textSecondary} />
                  <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>
                    Out:
                  </Text>
                  <Text style={[styles.timeValue, { color: colors.text }]}>
                    {record.clockOutTime}
                  </Text>
                </View>
              )}
              
              {record.totalHours !== null && (
                <View style={styles.timeItem}>
                  <Clock size={16} color={colors.textSecondary} />
                  <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>
                    Hours:
                  </Text>
                  <Text style={[styles.timeValue, { color: colors.text }]}>
                    {record.totalHours}
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    padding: 20,
  },
  recordItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  timeContainer: {
    gap: 6,
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    marginLeft: 6,
    marginRight: 4,
  },
  timeValue: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
  },
});