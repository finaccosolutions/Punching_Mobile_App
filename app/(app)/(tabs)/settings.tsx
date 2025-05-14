import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import { 
  User, 
  Moon, 
  Sun, 
  Bell, 
  Globe, 
  MapPin, 
  Shield, 
  LogOut,
  ChevronRight
} from 'lucide-react-native';

export default function SettingsScreen() {
  const { colors, isDark, theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  
  const [pushNotifications, setPushNotifications] = useState(true);
  const [locationTracking, setLocationTracking] = useState(true);
  
  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
        },
      ]
    );
  };
  
  const handleThemeChange = () => {
    setTheme(isDark ? 'light' : 'dark');
  };
  
  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Settings
        </Text>
      </View>
      
      {/* Profile Section */}
      <Card style={styles.profileCard}>
        <View style={styles.profileContent}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.primaryLight }]}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <User size={24} color={colors.primary} />
            )}
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.text }]}>
              {user?.name || 'User'}
            </Text>
            <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
              {user?.email || 'email@example.com'}
            </Text>
            <Text style={[styles.profileRole, { color: colors.primary }]}>
              {user?.role === 'admin' ? 'Administrator' : 'Employee'}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity style={[styles.editProfileButton, { borderColor: colors.border }]}>
          <Text style={[styles.editProfileText, { color: colors.primary }]}>
            Edit Profile
          </Text>
        </TouchableOpacity>
      </Card>
      
      {/* Appearance Settings */}
      <Card style={styles.card}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Appearance
        </Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            {isDark ? (
              <Moon size={20} color={colors.textSecondary} />
            ) : (
              <Sun size={20} color={colors.textSecondary} />
            )}
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              Dark Mode
            </Text>
          </View>
          
          <Switch
            value={isDark}
            onValueChange={handleThemeChange}
            trackColor={{ false: '#767577', true: colors.primaryLight }}
            thumbColor={isDark ? colors.primary : '#f4f3f4'}
          />
        </View>
      </Card>
      
      {/* Notification Settings */}
      <Card style={styles.card}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Notifications
        </Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <Bell size={20} color={colors.textSecondary} />
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              Push Notifications
            </Text>
          </View>
          
          <Switch
            value={pushNotifications}
            onValueChange={setPushNotifications}
            trackColor={{ false: '#767577', true: colors.primaryLight }}
            thumbColor={pushNotifications ? colors.primary : '#f4f3f4'}
          />
        </View>
      </Card>
      
      {/* Location Settings */}
      <Card style={styles.card}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Location
        </Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <MapPin size={20} color={colors.textSecondary} />
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              Location Tracking
            </Text>
          </View>
          
          <Switch
            value={locationTracking}
            onValueChange={setLocationTracking}
            trackColor={{ false: '#767577', true: colors.primaryLight }}
            thumbColor={locationTracking ? colors.primary : '#f4f3f4'}
          />
        </View>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <Globe size={20} color={colors.textSecondary} />
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              Office Locations
            </Text>
          </View>
          
          <ChevronRight size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </Card>
      
      {/* Security Settings */}
      <Card style={styles.card}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Security
        </Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <Shield size={20} color={colors.textSecondary} />
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              Change Password
            </Text>
          </View>
          
          <ChevronRight size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </Card>
      
      {/* Logout Button */}
      <TouchableOpacity onPress={handleLogout}>
        <Card style={[styles.logoutCard, { backgroundColor: colors.errorLight }]}>
          <View style={styles.logoutContent}>
            <LogOut size={20} color={colors.error} />
            <Text style={[styles.logoutText, { color: colors.error }]}>
              Log Out
            </Text>
          </View>
        </Card>
      </TouchableOpacity>
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
  profileCard: {
    marginBottom: 16,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 2,
  },
  profileRole: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  editProfileButton: {
    borderTopWidth: 1,
    paddingTop: 12,
    alignItems: 'center',
  },
  editProfileText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  card: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginLeft: 12,
  },
  logoutCard: {
    marginTop: 8,
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
});