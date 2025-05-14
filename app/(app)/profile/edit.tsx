import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import TextField from '@/components/ui/TextField';
import Button from '@/components/ui/Button';
import { User, Mail, Lock, X } from 'lucide-react-native';

export default function EditProfileScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { user, updateProfile, changePassword, isLoading, error } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [nameError, setNameError] = useState('');
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const handleUpdateProfile = async () => {
    setNameError('');
    
    if (!name.trim()) {
      setNameError('Name is required');
      return;
    }
    
    try {
      await updateProfile({ name: name.trim() });
      router.back();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  
  const handleChangePassword = async () => {
    setCurrentPasswordError('');
    setNewPasswordError('');
    setConfirmPasswordError('');
    
    let isValid = true;
    
    if (!currentPassword) {
      setCurrentPasswordError('Current password is required');
      isValid = false;
    }
    
    if (!newPassword) {
      setNewPasswordError('New password is required');
      isValid = false;
    } else if (newPassword.length < 6) {
      setNewPasswordError('Password must be at least 6 characters');
      isValid = false;
    }
    
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }
    
    if (!isValid) return;
    
    try {
      await changePassword(currentPassword, newPassword);
      router.back();
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={[styles.header, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.title, { color: colors.text }]}>Edit Profile</Text>
        <Button
          title="Close"
          variant="outline"
          onPress={() => router.back()}
          leftIcon={<X size={18} color={colors.primary} />}
        />
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {error && (
          <View style={[styles.errorCard, { backgroundColor: colors.errorLight }]}>
            <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
          </View>
        )}
        
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Personal Information
          </Text>
          
          <TextField
            label="Full Name"
            value={name}
            onChangeText={setName}
            error={nameError}
            leftIcon={<User size={20} color={colors.textSecondary} />}
          />
          
          <TextField
            label="Email"
            value={user?.email}
            disabled
            leftIcon={<Mail size={20} color={colors.textSecondary} />}
          />
          
          <Button
            title="Update Profile"
            onPress={handleUpdateProfile}
            loading={isLoading}
            style={{ marginTop: 16 }}
          />
        </Card>
        
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Change Password
          </Text>
          
          <TextField
            label="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            error={currentPasswordError}
            leftIcon={<Lock size={20} color={colors.textSecondary} />}
          />
          
          <TextField
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            error={newPasswordError}
            leftIcon={<Lock size={20} color={colors.textSecondary} />}
          />
          
          <TextField
            label="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={confirmPasswordError}
            leftIcon={<Lock size={20} color={colors.textSecondary} />}
          />
          
          <Button
            title="Change Password"
            onPress={handleChangePassword}
            loading={isLoading}
            style={{ marginTop: 16 }}
          />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  errorCard: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
});