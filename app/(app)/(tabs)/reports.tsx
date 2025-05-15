import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import { ClipboardList, Calendar, ArrowRight, Filter, Clock, Circle as XCircle } from 'lucide-react-native';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { getAttendanceSummary, AttendanceSummary } from '@/services/attendanceService';
import AttendanceChart from '@/components/reports/AttendanceChart';
import MonthSelector from '@/components/reports/MonthSelector';

export default function ReportsScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (!user) return;
    
    const fetchAttendanceSummary = async () => {
      try {
        setIsLoading(true);
        
        const startDate = format(startOfMonth(selectedMonth), 'yyyy-MM-dd');
        const endDate = format(endOfMonth(selectedMonth), 'yyyy-MM-dd');
        
        const summaryData = await getAttendanceSummary(startDate, endDate, user.id);
        
        if (summaryData.length > 0) {
          setAttendanceSummary(summaryData[0]);
        } else {
          setAttendanceSummary(null);
        }
      } catch (error) {
        console.error('Error fetching attendance summary:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAttendanceSummary();
  }, [selectedMonth, user]);
  
  const handlePreviousMonth = () => {
    setSelectedMonth(prevMonth => subMonths(prevMonth, 1));
  };
  
  const handleNextMonth = () => {
    const nextMonth = new Date(selectedMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    // Don't allow selecting future months
    if (nextMonth <= new Date()) {
      setSelectedMonth(nextMonth);
    }
  };
  
  const getHoursText = () => {
    if (!attendanceSummary) return '0 hrs';
    
    const totalHours = attendanceSummary.totalHours;
    return `${totalHours} ${totalHours === 1 ? 'hr' : 'hrs'}`;
  };
  
  const getAttendanceRate = () => {
    if (!attendanceSummary || attendanceSummary.totalDays === 0) return '0%';
    
    const rate = (attendanceSummary.present / attendanceSummary.totalDays) * 100;
    return `${Math.round(rate)}%`;
  };
  
  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Attendance Reports
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          View and analyze your attendance data
        </Text>
      </View>
      
      {/* Month Selector */}
      <MonthSelector
        selectedMonth={selectedMonth}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
      />
      
      {/* Summary Card */}
      <Card style={styles.card}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          Monthly Summary
        </Text>
        
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <View style={[styles.summaryIcon, { backgroundColor: colors.primaryLight }]}>
              <Calendar size={18} color={colors.primary} />
            </View>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              Working Days
            </Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {attendanceSummary?.totalDays || 0}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <View style={[styles.summaryIcon, { backgroundColor: colors.successLight }]}>
              <ClipboardList size={18} color={colors.success} />
            </View>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              Present
            </Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {attendanceSummary?.present || 0}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <View style={[styles.summaryIcon, { backgroundColor: colors.warningLight }]}>
              <Clock size={18} color={colors.warning} />
            </View>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              Late
            </Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {attendanceSummary?.late || 0}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <View style={[styles.summaryIcon, { backgroundColor: colors.errorLight }]}>
              <XCircle size={18} color={colors.error} />
            </View>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              Absent
            </Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {attendanceSummary?.absent || 0}
            </Text>
          </View>
        </View>
        
        <View style={styles.extraStats}>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Attendance Rate
            </Text>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {getAttendanceRate()}
            </Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Total Hours
            </Text>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {getHoursText()}
            </Text>
          </View>
        </View>
      </Card>
      
      {/* Attendance Chart */}
      <AttendanceChart
        attendanceSummary={attendanceSummary}
        isLoading={isLoading}
      />
      
      {/* Link to detailed reports */}
      <TouchableOpacity>
        <Card style={styles.linkCard}>
          <View style={styles.linkContent}>
            <View>
              <Text style={[styles.linkTitle, { color: colors.text }]}>
                View Detailed Reports
              </Text>
              <Text style={[styles.linkSubtitle, { color: colors.textSecondary }]}>
                Access full attendance history and analytics
              </Text>
            </View>
            <ArrowRight size={20} color={colors.primary} />
          </View>
        </Card>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  summaryItem: {
    width: '50%',
    padding: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  extraStats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginHorizontal: 8,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  linkCard: {
    marginTop: 8,
  },
  linkContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linkTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  linkSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});