import React from 'react';
import { Tabs } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Clock, Users, ClipboardList, DollarSign, Settings } from 'lucide-react-native';

export default function TabLayout() {
  const { colors } = useTheme();
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'admin';
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.cardBackground,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
        },
        headerShown: false,
      }}
    >
      {isAdmin ? (
        <>
          <Tabs.Screen
            name="employees"
            options={{
              title: 'Employees',
              tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="reports"
            options={{
              title: 'Reports',
              tabBarIcon: ({ color, size }) => <ClipboardList size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="payroll"
            options={{
              title: 'Payroll',
              tabBarIcon: ({ color, size }) => <DollarSign size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: 'Settings',
              tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
            }}
          />
        </>
      ) : (
        <>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Attendance',
              tabBarIcon: ({ color, size }) => <Clock size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="reports"
            options={{
              title: 'Reports',
              tabBarIcon: ({ color, size }) => <ClipboardList size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: 'Settings',
              tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
            }}
          />
        </>
      )}
    </Tabs>
  );
}