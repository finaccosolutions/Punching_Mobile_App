import React from 'react';
import { StyleSheet, View, Text, Dimensions, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Card from '@/components/ui/Card';
import { BarChart } from 'react-native-chart-kit';
import { AttendanceSummary } from '@/services/attendanceService';

interface AttendanceChartProps {
  attendanceSummary: AttendanceSummary | null;
  isLoading: boolean;
}

export default function AttendanceChart({
  attendanceSummary,
  isLoading,
}: AttendanceChartProps) {
  const { colors, isDark } = useTheme();
  const screenWidth = Dimensions.get('window').width - 32; // Accounting for padding
  
  if (isLoading) {
    return (
      <Card style={styles.card}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          Attendance Breakdown
        </Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading chart data...
          </Text>
        </View>
      </Card>
    );
  }
  
  if (!attendanceSummary) {
    return (
      <Card style={styles.card}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          Attendance Breakdown
        </Text>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No attendance data available for this month.
          </Text>
        </View>
      </Card>
    );
  }
  
  const chartData = {
    labels: ['Present', 'Late', 'Half-Day', 'Absent'],
    datasets: [
      {
        data: [
          attendanceSummary.present,
          attendanceSummary.late,
          attendanceSummary.halfDay,
          attendanceSummary.absent
        ],
      },
    ],
  };
  
  const chartConfig = {
    backgroundGradientFrom: isDark ? colors.cardBackground : colors.white,
    backgroundGradientTo: isDark ? colors.cardBackground : colors.white,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(${isDark ? '59, 130, 246' : '37, 99, 235'}, ${opacity})`,
    labelColor: (opacity = 1) => colors.text + (opacity < 1 ? Math.round(opacity * 255).toString(16) : ''),
    style: {
      borderRadius: 16,
    },
    barPercentage: 0.7,
  };
  
  return (
    <Card style={styles.card}>
      <Text style={[styles.cardTitle, { color: colors.text }]}>
        Attendance Breakdown
      </Text>
      
      <View style={styles.chartContainer}>
        <BarChart
          data={chartData}
          width={screenWidth - 32} // Account for card padding
          height={220}
          chartConfig={chartConfig}
          verticalLabelRotation={0}
          fromZero
          showValuesOnTopOfBars
          style={styles.chart}
        />
      </View>
      
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.primary }]} />
          <Text style={[styles.legendText, { color: colors.text }]}>Present</Text>
        </View>
        
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.warning }]} />
          <Text style={[styles.legendText, { color: colors.text }]}>Late</Text>
        </View>
        
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.accent }]} />
          <Text style={[styles.legendText, { color: colors.text }]}>Half-Day</Text>
        </View>
        
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.error }]} />
          <Text style={[styles.legendText, { color: colors.text }]}>Absent</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 8,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginHorizontal: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  loadingContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  emptyContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
});