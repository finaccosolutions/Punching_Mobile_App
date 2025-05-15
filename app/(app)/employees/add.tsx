import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import Card from '@/components/ui/Card';
import TextField from '@/components/ui/TextField';
import Button from '@/components/ui/Button';
import { createEmployee } from '@/services/employeeService';

export default function AddEmployeeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ email: string; password: string } | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    salary: '',
    phoneNumber: '',
    joiningDate: '',
    address: '',
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Basic validation
      if (!formData.name || !formData.email || !formData.department || 
          !formData.position || !formData.salary || !formData.phoneNumber || 
          !formData.joiningDate) {
        throw new Error('Please fill in all required fields');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Salary validation
      const salary = parseFloat(formData.salary);
      if (isNaN(salary) || salary <= 0) {
        throw new Error('Please enter a valid salary amount');
      }

      const result = await createEmployee({
        ...formData,
        salary: parseFloat(formData.salary),
      });

      setSuccess({
        email: formData.email,
        password: result.tempPassword,
      });

      // Clear form after 5 seconds and redirect
      setTimeout(() => {
        router.push('/employees');
      }, 5000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Add New Employee</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Create a new employee account with login credentials
        </Text>
      </View>

      <Card style={styles.formCard}>
        {error && (
          <View style={[styles.messageCard, { backgroundColor: colors.error + '20' }]}>
            <Text style={[styles.messageText, { color: colors.error }]}>{error}</Text>
          </View>
        )}

        {success && (
          <View style={[styles.messageCard, { backgroundColor: colors.success + '20' }]}>
            <Text style={[styles.messageText, { color: colors.success }]}>
              Employee account created successfully!{'\n\n'}
              Login Credentials:{'\n'}
              Email: {success.email}{'\n'}
              Temporary Password: {success.password}{'\n\n'}
              Redirecting to employees list...
            </Text>
          </View>
        )}

        <TextField
          label="Full Name"
          value={formData.name}
          onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
          placeholder="Enter employee's full name"
          required
        />

        <TextField
          label="Email"
          value={formData.email}
          onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
          placeholder="Enter work email address"
          keyboardType="email-address"
          autoCapitalize="none"
          required
        />

        <TextField
          label="Department"
          value={formData.department}
          onChangeText={(text) => setFormData(prev => ({ ...prev, department: text }))}
          placeholder="Enter department name"
          required
        />

        <TextField
          label="Position"
          value={formData.position}
          onChangeText={(text) => setFormData(prev => ({ ...prev, position: text }))}
          placeholder="Enter job position"
          required
        />

        <TextField
          label="Salary"
          value={formData.salary}
          onChangeText={(text) => setFormData(prev => ({ ...prev, salary: text }))}
          placeholder="Enter annual salary"
          keyboardType="numeric"
          required
        />

        <TextField
          label="Phone Number"
          value={formData.phoneNumber}
          onChangeText={(text) => setFormData(prev => ({ ...prev, phoneNumber: text }))}
          placeholder="Enter contact number"
          keyboardType="phone-pad"
          required
        />

        <TextField
          label="Joining Date"
          value={formData.joiningDate}
          onChangeText={(text) => setFormData(prev => ({ ...prev, joiningDate: text }))}
          placeholder="YYYY-MM-DD"
          required
        />

        <TextField
          label="Address"
          value={formData.address}
          onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
          placeholder="Enter residential address"
          multiline
          numberOfLines={3}
        />

        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            onPress={() => router.back()}
            variant="secondary"
            style={styles.button}
          />
          <Button
            title={loading ? 'Creating...' : 'Create Employee'}
            onPress={handleSubmit}
            disabled={loading}
            style={styles.button}
          />
        </View>
      </Card>
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
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  formCard: {
    padding: 24,
  },
  messageCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  messageText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
  },
});