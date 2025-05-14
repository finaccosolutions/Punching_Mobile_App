import { Platform } from 'react-native';
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

// This file serves as the entry point.
// The actual implementation will be loaded from either
// AttendanceMap.native.tsx or AttendanceMap.web.tsx
// based on the platform.

let AttendanceMap: React.FC<AttendanceMapProps>;

if (Platform.OS === 'web') {
  AttendanceMap = require('./AttendanceMap.web').default;
} else {
  AttendanceMap = require('./AttendanceMap.native').default;
}

export default AttendanceMap;