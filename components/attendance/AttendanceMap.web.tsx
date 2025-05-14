import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { MapPin } from 'lucide-react-native';
import * as Location from 'expo-location';

interface AttendanceMapProps {
  currentLocation: Location.LocationObject | null;
  isWithinOffice: boolean;
  officeInfo?: {
    latitude: number;
    longitude: number;
    radius: number;
    name: string;
    address: string;
  } | null;
}

export default function AttendanceMap({
  currentLocation,
  isWithinOffice,
}: AttendanceMapProps) {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.mapPlaceholder, { backgroundColor: colors.cardBackgroundAlt }]}>
      <MapPin size={24} color={colors.textSecondary} />
      <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
        {!currentLocation 
          ? 'Waiting for location data...' 
          : 'Map view not available on web platform'
        }
      </Text>
      {currentLocation && (
        <View style={styles.locationContainer}>
          <Text style={[styles.locationText, { color: colors.textSecondary }]}>
            <Text>Location: </Text>
            <Text>{currentLocation.coords.latitude.toFixed(6)}</Text>
            <Text>, </Text>
            <Text>{currentLocation.coords.longitude.toFixed(6)}</Text>
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mapPlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  locationContainer: {
    marginTop: 8,
  },
  locationText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
});