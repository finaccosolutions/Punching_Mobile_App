import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import MapView, { Marker, Circle } from 'react-native-maps';
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
  officeInfo,
}: AttendanceMapProps) {
  const { isDark } = useTheme();
  
  if (!currentLocation) {
    return null;
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
});