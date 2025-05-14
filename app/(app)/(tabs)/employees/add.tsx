import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import Card from '@/components/ui/Card';
import TextField from '@/components/ui/TextField';
import Button from '@/components/ui/Button';
import { User, Mail, Building, DollarSign, Phone, Calendar, MapPin } from 'lucide-react-native';
import { createEmployee } from '@/services/employeeService';

export default function AddEmployeeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    department: '',
    position: '',
    salary: '',
    phoneNumber: '',
    joiningDate: '',
    address: '',
  });
  
  const [formErrors, setFormErrors] = useState({
    email: '',
    name: '',
    department: '',
    position: '',
    salary: '',
    phoneNumber: '',
    joiningDate: '',
  });
  
  const validateForm = () => {
    const errors = {
      email: '',
      name: '',
      department: '',
      position: '',
      salary: '',
      phoneNumber: '',
      joiningDate: '',
    };
    
    let isValid = true;
    
    if (!formData.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email format';
      isValid = false;
    }
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }
    
    if (!formData.department.trim()) {
      errors.department = 'Department is required';
      isValid = false;
    }
    
    if (!formData.position.trim()) {
      errors.position = 'Position is required';
      isValid = false;
    }
    
    if (!formData.salary) {
      errors.salary = 'Salary is required';
      isValid = false;
    } else if (isNaN(Number(formData.salary))) {
      errors.salary = 'Invalid salary amount';
      isValid = false;
    }
    
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
      isValid = false;
    }
    
    if (!formData.joiningDate.trim()) {
      errors.joiningDate = 'Joining date is required';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await createEmployee({
        email: formData.email,
        name: formData.name,
        department: formData.department,
        position: formData.position,
        salary: Number(formData.salary),
        phoneNumber: formData.phoneNumber,
        joiningDate: formData.joiningDate,
        address: formData.address,
      });
      
      router.back();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.text }]}>
          Add New Employee
        </Text>
        
        {error && (
          <View style={[styles.errorCard, { backgroundColor: colors.errorLight }]}>
            <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
          </View>
        )}
        
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Basic Information
          </Text>
          
          <TextField
            label="Email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            error={formErrors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Mail size={20} color={colors.textSecondary} />}
          />
          
          <TextField
            label="Full Name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            error={formErrors.name}
            leftIcon={<User size={20} color={colors.textSecondary} />}
          />
          
          <TextField
            label="Department"
            value={formData.department}
            onChangeText={(text) => setFormData({ ...formData, department: text })}
            error={formErrors.department}
            leftIcon={<Building size={20} color={colors.textSecondary} />}
          />
          
          <TextField
            label="Position"
            value={formData.position}
            onChangeText={(text) => setFormData({ ...formData, position: text })}
            error={formErrors.position}
            leftIcon={<Building size={20} color={colors.textSecondary} />}
          />
          
          <TextField
            label="Salary"
            value={formData.salary}
            onChangeText={(text) => setFormData({ ...formData, salary: text })}
            error={formErrors.salary}
            keyboardType="numeric"
            leftIcon={<DollarSign size={20} color={colors.textSecondary} />}
          />
        </Card>
        
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Additional Details
          </Text>
          
          <TextField
            label="Phone Number"
            value={formData.phoneNumber}
            onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
            error={formErrors.phoneNumber}
            keyboardType="phone-pad"
            leftIcon={<Phone size={20} color={colors.textSecondary} />}
          />
          
          <TextField
            label="Joining Date"
            value={formData.joiningDate}
            onChangeText={(text) => setFormData({ ...formData, joiningDate: text })}
            error={formErrors.joiningDate}
            placeholder="YYYY-MM-DD"
            leftIcon={<Calendar size={20} color={colors.textSecondary} />}
          />
          
          <TextField
            label="Address"
            value={formData.address}
            onChangeText={(text) => setFormData({ ...formData, address: text })}
            multiline
            numberOfLines={3}
            leftIcon={<MapPin size={20} color={colors.textSecondary} />}
          />
        </Card>
        
        <Button
          title="Add Employee"
          onPress={handleSubmit}
          loading={isLoading}
          style={styles.submitButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
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
  submitButton: {
    marginBottom: 32,
  },
});