import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/context/ThemeContext';
import { useAuth, UserRole } from '@/context/AuthContext';
import TextField from '@/components/ui/TextField';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { UserPlus, Mail, Lock, User, Building } from 'lucide-react-native';

export default function RegisterScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { register, isLoading, error } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('employee');
  
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };
  
  const handleRegister = async () => {
    // Reset errors
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    
    // Validate inputs
    let isValid = true;
    
    if (!name) {
      setNameError('Name is required');
      isValid = false;
    }
    
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    }
    
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }
    
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }
    
    if (!isValid) return;
    
    // Perform registration
    try {
      await register(name, email, password, role);
    } catch (error) {
      console.error('Registration error:', error);
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
            <UserPlus color={colors.white} size={32} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Sign up for PunchPro attendance system
          </Text>
        </View>
        
        <Card style={styles.card}>
          {error && (
            <View style={[styles.errorCard, { backgroundColor: colors.errorLight }]}>
              <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
            </View>
          )}
          
          <TextField
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            error={nameError}
            leftIcon={<User size={20} color={colors.textSecondary} />}
          />
          
          <TextField
            label="Email"
            placeholder="Enter your email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailError}
            leftIcon={<Mail size={20} color={colors.textSecondary} />}
          />
          
          <TextField
            label="Password"
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={passwordError}
            leftIcon={<Lock size={20} color={colors.textSecondary} />}
          />
          
          <TextField
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={confirmPasswordError}
            leftIcon={<Lock size={20} color={colors.textSecondary} />}
          />
          
          <Text style={[styles.roleLabel, { color: colors.text }]}>Account Type</Text>
          <View style={styles.roleButtons}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                { 
                  backgroundColor: role === 'admin' ? colors.primary : colors.cardBackgroundAlt,
                  borderColor: role === 'admin' ? colors.primary : colors.border
                }
              ]}
              onPress={() => setRole('admin')}
            >
              <Building size={20} color={role === 'admin' ? colors.white : colors.textSecondary} />
              <Text 
                style={[
                  styles.roleButtonText, 
                  { color: role === 'admin' ? colors.white : colors.text }
                ]}
              >
                Admin
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.roleButton,
                { 
                  backgroundColor: role === 'employee' ? colors.primary : colors.cardBackgroundAlt,
                  borderColor: role === 'employee' ? colors.primary : colors.border
                }
              ]}
              onPress={() => setRole('employee')}
            >
              <User size={20} color={role === 'employee' ? colors.white : colors.textSecondary} />
              <Text 
                style={[
                  styles.roleButtonText, 
                  { color: role === 'employee' ? colors.white : colors.text }
                ]}
              >
                Employee
              </Text>
            </TouchableOpacity>
          </View>
          
          <Button
            title="Register"
            onPress={handleRegister}
            loading={isLoading}
            fullWidth
            style={{ marginTop: 24 }}
          />
          
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity style={styles.loginLink}>
              <Text style={[styles.loginLinkText, { color: colors.textSecondary }]}>
                Already have an account? <Text style={{ color: colors.primary }}>Log In</Text>
              </Text>
            </TouchableOpacity>
          </Link>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    width: 70,
    height: 70,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
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
  roleLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  roleButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  loginLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  loginLinkText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
});