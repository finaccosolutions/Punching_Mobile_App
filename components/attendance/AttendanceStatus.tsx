import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Card from '@/components/ui/Card';
import { Clock, RefreshCw } from 'lucide-react-native';
import { format } from 'date-fns';

interface AttendanceStatusProps {
  status: 'checked-in' | 'checked-out' | null;
  checkinTime: string | null;
  refreshStatus: () => void;
}

export default function AttendanceStatus({
  status,
  checkinTime,
  refreshStatus,
}: AttendanceStatusProps) {
  const { colors } = useTheme();
  
  const currentTime = format(new Date(), 'hh:mm a');
  const currentDate = format(new Date(), 'EEEE, MMMM d');
  
  const getStatusColor = () => {
    switch (status) {
      case 'checked-in':
        return colors.success;
      case 'checked-out':
        return colors.secondary;
      default:
        return colors.textSecondary;
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case 'checked-in':
        return 'Checked In';
      case 'checked-out':
        return 'Checked Out';
      default:
        return 'Not Checked In';
    }
  };
  
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Today's Status
        </Text>
        <TouchableOpacity onPress={refreshStatus} style={styles.refreshButton}>
          <RefreshCw size={16} color={colors.primary} />
          <Text style={[styles.refreshText, { color: colors.primary }]}>Refresh</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.statusContainer}>
        <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {getStatusText()}
        </Text>
      </View>
      
      <View style={styles.timeInfoContainer}>
        <View style={styles.timeInfo}>
          <Clock size={18} color={colors.textSecondary} />
          <Text style={[styles.timeInfoText, { color: colors.text }]}>
            Current Time: <Text style={styles.timeValue}>{currentTime}</Text>
          </Text>
        </View>
        
        {status === 'checked-in' && checkinTime && (
          <View style={styles.timeInfo}>
            <Clock size={18} color={colors.textSecondary} />
            <Text style={[styles.timeInfoText, { color: colors.text }]}>
              Checked In at: <Text style={styles.timeValue}>{checkinTime}</Text>
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshText: {
    marginLeft: 4,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  timeInfoContainer: {
    gap: 8,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInfoText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  timeValue: {
    fontFamily: 'Inter-Medium',
  },
});