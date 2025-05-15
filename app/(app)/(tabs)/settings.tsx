import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react-native';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const { signOut, user } = useAuth();
  
  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.title, { color: colors.text }]}>Account Settings</Text>
        
        <View style={styles.userInfo}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Signed in as:</Text>
          <Text style={[styles.value, { color: colors.text }]}>{user?.email}</Text>
          <Text style={[styles.role, { color: colors.primary }]}>
            {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.danger }]}
          onPress={signOut}
        >
          <LogOut size={20} color="white" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 20,
  },
  userInfo: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
});