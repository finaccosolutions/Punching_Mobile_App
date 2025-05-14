import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Users, Search, Plus, Filter } from 'lucide-react-native';
import { getAllEmployees } from '@/services/employeeService';
import EmployeeListItem from '@/components/employees/EmployeeListItem';

export default function EmployeesScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  
  // Redirect non-admin users
  if (user?.role !== 'admin') {
    router.replace('/');
    return null;
  }
  
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        const data = await getAllEmployees();
        setEmployees(data);
        setFilteredEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEmployees();
  }, []);
  
  const handleAddEmployee = () => {
    router.push('/employees/add');
  };
  
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Manage Employees
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Add and manage employee accounts
          </Text>
        </View>
        
        {/* Search and Filter */}
        <Card style={styles.searchCard} variant="filled">
          <View style={styles.searchContainer}>
            <View style={[styles.searchInputContainer, { backgroundColor: colors.cardBackground }]}>
              <Search size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Search employees..."
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            
            <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.cardBackground }]}>
              <Filter size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </Card>
        
        {/* Add Employee Button */}
        <Button
          title="Add New Employee"
          onPress={handleAddEmployee}
          leftIcon={<Plus size={18} color={colors.white} />}
          style={styles.addButton}
        />
        
        {/* Employee List */}
        <View style={styles.employeesList}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Employee Directory
          </Text>
          
          {isLoading ? (
            <Card style={styles.messageCard}>
              <Text style={[styles.messageText, { color: colors.textSecondary }]}>
                Loading employees...
              </Text>
            </Card>
          ) : filteredEmployees.length === 0 ? (
            <Card style={styles.messageCard}>
              <Text style={[styles.messageText, { color: colors.textSecondary }]}>
                No employees found
              </Text>
            </Card>
          ) : (
            filteredEmployees.map((employee) => (
              <EmployeeListItem
                key={employee.id}
                employee={employee}
                onPress={() => router.push(`/employees/${employee.id}`)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
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
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  searchCard: {
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    paddingVertical: 4,
  },
  filterButton: {
    padding: 12,
    borderRadius: 8,
  },
  addButton: {
    marginBottom: 20,
  },
  employeesList: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  messageCard: {
    padding: 20,
    alignItems: 'center',
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});