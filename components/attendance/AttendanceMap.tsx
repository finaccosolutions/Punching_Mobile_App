import React from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { MapPin } from 'lucide-react-native';
import * as Location from 'expo-location';

// Define types for map components
type MapViewType = typeof import('react-native-maps').default;
type MarkerType = typeof import('react-native-maps').Marker;
type CircleType = typeof import('react-native-maps').Circle;

// Initialize map components as null for web
let MapView: MapViewType | null = null;
let Marker: MarkerType | null = null;
let Circle: CircleType | null = null;

// Only import map components on native platforms
if (Platform.OS !== 'web') {
  try {
    const { default: RNMapView, Marker: RNMarker, Circle: RNCircle } = require('react-native-maps');
    MapView = RNMapView;
    Marker = RNMarker;
    Circle = RNCircle;
  } catch (error) {
    console.warn('react-native-maps not available', error);
  }
}

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
  officeInfo,
}: AttendanceMapProps) {
  const { colors, isDark } = useTheme();
  
  // Show placeholder on web or when location/map is not available
  const showPlaceholder = Platform.OS === 'web' || !currentLocation || !MapView;
  
  if (showPlaceholder) {
    return (
      <View style={[styles.mapPlaceholder, { backgroundColor: colors.cardBackgroundAlt }]}>
        <MapPin size={24} color={colors.textSecondary} />
        <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
          {!currentLocation 
            ? 'Waiting for location data...' 
            : 'Map view not available on this platform'
          }
        </Text>
      </View>
    );
  }

  // Custom map style for dark mode
  const mapStyle = isDark ? [
    {
      "elementType": "geometry",
      "stylers": [{ "color": "#242f3e" }]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#746855" }]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#242f3e" }]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#d59563" }]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [{ "color": "#38414e" }]
    },
    {
      "featureType": "road",
      "elementType": "geometry.stroke",
      "stylers": [{ "color": "#212a37" }]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#9ca5b3" }]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{ "color": "#17263c" }]
    }
  ] : [];

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        customMapStyle={mapStyle}
        initialRegion={{
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        {/* User's current location */}
        <Marker
          coordinate={{
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          }}
          title="Your Location"
          pinColor={isWithinOffice ? "green" : "red"}
        />
        
        {/* Accuracy circle around user's location */}
        <Circle
          center={{
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          }}
          radius={currentLocation.coords.accuracy || 50}
          fillColor="rgba(77, 123, 245, 0.2)"
          strokeColor="rgba(77, 123, 245, 0.5)"
        />
        
        {/* Office location if available */}
        {officeInfo && (
          <>
            <Marker
              coordinate={{
                latitude: officeInfo.latitude,
                longitude: officeInfo.longitude,
              }}
              title={officeInfo.name}
              description={officeInfo.address}
              pinColor="blue"
            />
            
            <Circle
              center={{
                latitude: officeInfo.latitude,
                longitude: officeInfo.longitude,
              }}
              radius={officeInfo.radius}
              fillColor="rgba(0, 100, 0, 0.1)"
              strokeColor="rgba(0, 100, 0, 0.3)"
            />
          </>
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 200,
  },
  map: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  mapPlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
});