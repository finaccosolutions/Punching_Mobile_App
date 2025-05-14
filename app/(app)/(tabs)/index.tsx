import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert, ScrollView, Image, Linking, Platform } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { MapPin, Clock, Calendar, CircleCheck as CheckCircle, Circle as XCircle, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import * as Location from 'expo-location';
import { format } from 'date-fns';
import { clockIn, clockOut } from '@/services/attendanceService';
import { getCurrentLocation, isWithinAnyOffice, checkLocationServices, isLocationMocked } from '@/utils/locationUtils';
import AttendanceStatus from '@/components/attendance/AttendanceStatus';
import AttendanceMap from '@/components/attendance/AttendanceMap';
import RecentActivity from '@/components/attendance/RecentActivity';

export default function AttendanceScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [isWithinOffice, setIsWithinOffice] = useState(false);
  const [officeInfo, setOfficeInfo] = useState<any>(null);
  const [attendanceStatus, setAttendanceStatus] = useState<'checked-in' | 'checked-out' | null>(null);
  const [checkinTime, setCheckinTime] = useState<string | null>(null);
  
  // Clear success/error messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [success, error]);
  
  // Check location permission and get current location
  const checkLocationAndPermissions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check if location services are enabled
      const locationServicesEnabled = await checkLocationServices();
      if (!locationServicesEnabled) {
        setError('Location services are disabled. Please enable them to check in.');
        setIsLoading(false);
        return;
      }
      
      // Get current location
      const location = await getCurrentLocation();
      if (!location) {
        setError('Unable to get your current location.');
        setIsLoading(false);
        return;
      }
      
      // Check if location is mocked (anti-spoofing measure)
      if (Platform.OS !== 'web') {
        const mocked = await isLocationMocked();
        if (mocked) {
          setError('Fake location detected. Please disable mock location apps.');
          setIsLoading(false);
          return;
        }
      }
      
      setCurrentLocation(location);
      
      // Check if user is within any office
      const officeCheck = await isWithinAnyOffice({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      
      setIsWithinOffice(officeCheck.isWithin);
      setOfficeInfo(officeCheck.office);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error checking location:', error);
      setError('An error occurred while checking your location.');
      setIsLoading(false);
    }
  };
  
  // Handle clock in
  const handleClockIn = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      if (!currentLocation) {
        // Try to get location again if not available
        await checkLocationAndPermissions();
        if (!currentLocation) {
          return; // Error will be set by checkLocationAndPermissions
        }
      }
      
      // Record clock in
      const result = await clockIn(
        user.id,
        user.name,
        {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          accuracy: currentLocation.coords.accuracy,
          timestamp: currentLocation.timestamp,
        }
      );
      
      setAttendanceStatus('checked-in');
      setCheckinTime(result.clockInTime);
      setSuccess('Clock-in successful!');
      
      // Show warning if not in office
      if (!isWithinOffice) {
        Alert.alert(
          'Remote Clock-in',
          'You are not at a registered office location. This will be recorded as a remote check-in.',
          [{ text: 'OK' }]
        );
      }
      
    } catch (error: any) {
      console.error('Clock in error:', error);
      setError(error.message || 'Failed to clock in.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle clock out
  const handleClockOut = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      if (!currentLocation) {
        // Try to get location again if not available
        await checkLocationAndPermissions();
        if (!currentLocation) {
          return; // Error will be set by checkLocationAndPermissions
        }
      }
      
      // Record clock out
      await clockOut(
        user.id,
        {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          accuracy: currentLocation.coords.accuracy,
          timestamp: currentLocation.timestamp,
        }
      );
      
      setAttendanceStatus('checked-out');
      setSuccess('Clock-out successful!');
      
    } catch (error: any) {
      console.error('Clock out error:', error);
      setError(error.message || 'Failed to clock out.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial location check when component mounts
  useEffect(() => {
    checkLocationAndPermissions();
  }, []);
  
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
        <Text style={[styles.date, { color: colors.textSecondary }]}>
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </Text>
      </View>
      
      {/* Status Messages */}
      {error && (
        <Card 
          style={styles.messageCard} 
          variant="filled"
        >
          <View style={styles.messageContent}>
            <AlertTriangle size={20} color={colors.error} />
            <Text style={[styles.messageText, { color: colors.error }]}>{error}</Text>
          </View>
        </Card>
      )}
      
      {success && (
        <Card 
          style={styles.messageCard} 
          variant="filled"
        >
          <View style={styles.messageContent}>
            <CheckCircle size={20} color={colors.success} />
            <Text style={[styles.messageText, { color: colors.success }]}>{success}</Text>
          </View>
        </Card>
      )}
      
      {/* Attendance Status Card */}
      <AttendanceStatus 
        status={attendanceStatus} 
        checkinTime={checkinTime} 
        refreshStatus={checkLocationAndPermissions}
      />
      
      {/* Location Card */}
      <Card style={styles.card}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          Your Location
        </Text>
        
        <AttendanceMap 
          currentLocation={currentLocation} 
          isWithinOffice={isWithinOffice}
          officeInfo={officeInfo}
        />
        
        <View style={styles.locationInfo}>
          <MapPin size={20} color={colors.primary} />
          <Text style={[styles.locationText, { color: colors.text }]}>
            {isWithinOffice
              ? `At Office: ${officeInfo?.name || 'Company Office'}`
              : 'Not at office location (Remote)'
            }
          </Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Refresh Location"
            onPress={checkLocationAndPermissions}
            variant="outline"
            loading={isLoading}
            leftIcon={<MapPin size={16} color={colors.primary} />}
            style={{ flex: 1 }}
          />
        </View>
      </Card>
      
      {/* Clock In/Out Card */}
      <Card style={styles.card}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          Clock In/Out
        </Text>
        <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
          {attendanceStatus === 'checked-in'
            ? 'You are currently clocked in. Don\'t forget to clock out at the end of your work day.'
            : 'Please clock in to start recording your attendance.'
          }
        </Text>
        
        <View style={styles.clockButtonContainer}>
          <Button
            title="Clock In"
            onPress={handleClockIn}
            disabled={attendanceStatus === 'checked-in' || isLoading}
            loading={isLoading && attendanceStatus !== 'checked-in'}
            leftIcon={<Clock size={18} color={colors.white} />}
            style={{ flex: 1, opacity: attendanceStatus === 'checked-in' ? 0.5 : 1 }}
          />
          
          <Button
            title="Clock Out"
            onPress={handleClockOut}
            disabled={attendanceStatus !== 'checked-in' || isLoading}
            loading={isLoading && attendanceStatus === 'checked-in'}
            variant="secondary"
            leftIcon={<Clock size={18} color={colors.white} />}
            style={{ flex: 1, opacity: attendanceStatus !== 'checked-in' ? 0.5 : 1 }}
          />
        </View>
      </Card>
      
      {/* Recent Activity Card */}
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
  date: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  cardSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 15,
    fontFamily: 'Inter-Medium',
  },
  buttonContainer: {
    marginTop: 8,
    flexDirection: 'row',
  },
  clockButtonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  messageCard: {
    marginBottom: 16,
    padding: 12,
  },
  messageContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageText: {
    marginLeft: 8,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
});