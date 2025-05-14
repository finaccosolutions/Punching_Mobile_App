import * as Location from 'expo-location';
import { Platform } from 'react-native';

// Office location coordinates (example)
export const OFFICE_LOCATION = {
  latitude: 40.7128,
  longitude: -74.0060,
  radius: 200, // meters
};

// Check if location is within a certain radius of office
export const isWithinOffice = (
  location: { latitude: number; longitude: number },
  office = OFFICE_LOCATION
): boolean => {
  // Haversine formula to calculate distance between two coordinates
  const R = 6371e3; // Earth radius in meters
  const φ1 = (location.latitude * Math.PI) / 180;
  const φ2 = (office.latitude * Math.PI) / 180;
  const Δφ = ((office.latitude - location.latitude) * Math.PI) / 180;
  const Δλ = ((office.longitude - location.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance <= office.radius;
};

// Get current location
export const getCurrentLocation = async (): Promise<Location.LocationObject | null> => {
  try {
    // Request permissions
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      throw new Error('Location permission not granted');
    }
    
    // Get current position with high accuracy
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    
    return location;
  } catch (error) {
    console.error('Error getting location', error);
    return null;
  }
};

// Check if location services are enabled
export const checkLocationServices = async (): Promise<boolean> => {
  try {
    const enabled = await Location.hasServicesEnabledAsync();
    return enabled;
  } catch (error) {
    console.error('Error checking location services', error);
    return false;
  }
};

// Check if the device has mocked location
export const isLocationMocked = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'web') {
      // Can't detect mocked locations on web
      return false;
    }
    
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    
    return location.mocked || false;
  } catch (error) {
    console.error('Error checking if location is mocked', error);
    return false;
  }
};

// Add a new office location
export interface OfficeLocation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  radius: number; // meters
}

// Mock office locations
const mockOfficeLocations: OfficeLocation[] = [
  {
    id: '1',
    name: 'Headquarters',
    address: '123 Main St, New York, NY 10001',
    latitude: 40.7128,
    longitude: -74.0060,
    radius: 200,
  },
  {
    id: '2',
    name: 'Branch Office',
    address: '456 Market St, San Francisco, CA 94103',
    latitude: 37.7749,
    longitude: -122.4194,
    radius: 150,
  },
];

// Get all office locations
export const getOfficeLocations = async (): Promise<OfficeLocation[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [...mockOfficeLocations];
};

// Check if location is within any office
export const isWithinAnyOffice = async (
  location: { latitude: number; longitude: number }
): Promise<{ isWithin: boolean; office: OfficeLocation | null }> => {
  const offices = await getOfficeLocations();
  
  for (const office of offices) {
    if (isWithinOffice(location, office)) {
      return { isWithin: true, office };
    }
  }
  
  return { isWithin: false, office: null };
};