import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import TextField from '@/components/ui/TextField';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { LogIn, Mail, Lock } from 'lucide-react-native';

export default function LoginScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { login, isLoading, error } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };
  
  const handleLogin = async () => {
    // Reset errors
    setEmailError('');
    setPasswordError('');
    
    // Validate inputs
    let isValid = true;
    
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
    }
    
    if (!isValid) return;
    
    // Perform login
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  
  // Demo login helpers
  const loginAsAdmin = () => {
    setEmail('admin@example.com');
    setPassword('password');
  };
  
  const loginAsEmployee = () => {
    setEmail('employee@example.com');
    setPassword('password');
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
            <LogIn color={colors.white} size={32} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>PunchPro</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Employee Attendance & Payroll System
          </Text>
        </View>
        
        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Log In</Text>
          
          {error && (
            <View style={[styles.errorCard, { backgroundColor: colors.errorLight }]}>
              <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
            </View>
          )}
          
          <TextField
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailError}
            leftIcon={<Mail size={20} color={colors.textSecondary} />}
          />
          
          <TextField
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={passwordError}
            leftIcon={<Lock size={20} color={colors.textSecondary} />}
          />
          
          <Button
            title="Log In"
            onPress={handleLogin}
            loading={isLoading}
            fullWidth
            style={{ marginTop: 16 }}
          />
          
          <View style={styles.demoSection}>
            <Text style={[styles.demoText, { color: colors.textSecondary }]}>Demo Accounts:</Text>
            <View style={styles.demoButtons}>
              <TouchableOpacity
                style={[styles.demoButton, { backgroundColor: colors.primaryLight }]}
                onPress={loginAsAdmin}
              >
                <Text style={[styles.demoButtonText, { color: colors.primary }]}>Admin</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.demoButton, { backgroundColor: colors.primaryLight }]}
                onPress={loginAsEmployee}
              >
                <Text style={[styles.demoButtonText, { color: colors.primary }]}>Employee</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity style={styles.registerLink}>
              <Text style={[styles.registerLinkText, { color: colors.textSecondary }]}>
                Don't have an account? <Text style={{ color: colors.primary }}>Sign Up</Text>
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
    marginBottom: 32,
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
    fontSize: 30,
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
  cardTitle: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 24,
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
  demoSection: {
    marginTop: 24,
    marginBottom: 16,
  },
  demoText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginBottom: 8,
  },
  demoButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  demoButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  demoButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  registerLink: {
    marginTop: 8,
    alignItems: 'center',
  },
  registerLinkText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
});