import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import AttendanceStatus from '@/components/attendance/AttendanceStatus';
import AttendanceMap from '@/components/attendance/AttendanceMap';
import RecentActivity from '@/components/attendance/RecentActivity';
import { MapPin, Clock } from 'lucide-react-native';
import * as Location from 'expo-location';
import { getCurrentLocation, isWithinOffice } from '@/utils/locationUtils';

export default function AttendanceScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isWithinRange, setIsWithinRange] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState<'checked-in' | 'checked-out' | null>(null);
  const [checkinTime, setCheckinTime] = useState<string | null>(null);
  
  useEffect(() => {
    checkLocation();
  }, []);
  
  const checkLocation = async () => {
    const location = await getCurrentLocation();
    setCurrentLocation(location);
    
    if (location) {
      const withinOffice = isWithinOffice({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setIsWithinRange(withinOffice);
    }
  };
  
  const handleClockIn = async () => {
    setIsLoading(true);
    try {
      const location = await getCurrentLocation();
      if (!location) {
        throw new Error('Unable to get current location');
      }
      
      // TODO: Implement clock in API call
      setAttendanceStatus('checked-in');
      setCheckinTime(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error clocking in:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClockOut = async () => {
    setIsLoading(true);
    try {
      const location = await getCurrentLocation();
      if (!location) {
        throw new Error('Unable to get current location');
      }
      
      // TODO: Implement clock out API call
      setAttendanceStatus('checked-out');
    } catch (error) {
      console.error('Error clocking out:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Attendance
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Track your daily attendance
        </Text>
      </View>
      
      <AttendanceStatus
        status={attendanceStatus}
        checkinTime={checkinTime}
        refreshStatus={checkLocation}
      />
      
      <Card style={styles.locationCard}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          Location Status
        </Text>
        
        <AttendanceMap
          currentLocation={currentLocation}
          isWithinOffice={isWithinRange}
        />
        
        <View style={styles.locationStatus}>
          <MapPin size={20} color={isWithinRange ? colors.success : colors.error} />
          <Text 
            style={[
              styles.locationText, 
              { color: isWithinRange ? colors.success : colors.error }
            ]}
          >
            {isWithinRange ? 'Within office premises' : 'Outside office premises'}
          </Text>
        </View>
      </Card>
      
      <View style={styles.actionButtons}>
        <Button
          title="Clock In"
          onPress={handleClockIn}
          disabled={!isWithinRange || attendanceStatus === 'checked-in' || isLoading}
          loading={isLoading}
          leftIcon={<Clock size={18} color={colors.white} />}
          style={{ flex: 1 }}
        />
        
        <Button
          title="Clock Out"
          variant="secondary"
          onPress={handleClockOut}
          disabled={!isWithinRange || attendanceStatus !== 'checked-in' || isLoading}
          loading={isLoading}
          leftIcon={<Clock size={18} color={colors.white} />}
          style={{ flex: 1 }}
        />
      </View>
      
      <RecentActivity userId={user?.id} />
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
  locationCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  locationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
});