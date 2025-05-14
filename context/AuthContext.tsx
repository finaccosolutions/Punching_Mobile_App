import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useRouter, useSegments } from 'expo-router';

// Mock API for demonstration purposes
import { loginApi, registerApi } from '@/services/authService';

// User types
export type UserRole = 'admin' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  position?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

// Constants
const USER_KEY = 'punchpro_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const segments = useSegments();

  // Load user from secure storage on app start
  useEffect(() => {
    async function loadUser() {
      try {
        const userJSON = await SecureStore.getItemAsync(USER_KEY);
        if (userJSON) {
          const userData = JSON.parse(userJSON);
          setUser(userData);
        }
      } catch (e) {
        console.error('Failed to load user from storage', e);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  // Handle routing based on authentication state
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    // If user is not authenticated and not in auth group, redirect to login
    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } 
    // If user is authenticated and in auth group, redirect to app
    else if (user && inAuthGroup) {
      router.replace('/(app)/(tabs)');
    }
  }, [user, segments, isLoading]);

  // Authentication functions
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await loginApi(email, password);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));
      setUser(userData);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await registerApi(name, email, password, role);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));
      setUser(userData);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await SecureStore.deleteItemAsync(USER_KEY);
      setUser(null);
    } catch (e) {
      console.error('Error during logout', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};