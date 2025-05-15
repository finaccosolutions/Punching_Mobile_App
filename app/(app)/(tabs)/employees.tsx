import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  Phone, 
  Mail, 
  Briefcase, 
  Calendar,
  ChevronRight
} from 'lucide-react-native';
import { getAllEmployees, Employee } from '@/services/employeeService';
import EmployeeListItem from '@/components/employees/EmployeeListItem';
import Button from '@/components/ui/Button';

export default function EmployeesScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (user?.role !== 'admin') {
      router.replace('/');
      return;
    }

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
  }, [user, router]);
  
  useEffect(() => {
    const filtered = employees.filter(emp => 
      emp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredEmployees(filtered);
  }, [searchQuery, employees]);
  
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
            {user?.role === 'admin' ? 'Manage Employees' : 'Employees'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {user?.role === 'admin' ? 'Add and manage employee accounts' : 'View your team members'}
          </Text>
        </View>
        
        {/* Search and Filter Bar */}
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
        
        {/* Employee Stats - Only show if not admin */}
        {user?.role !== 'admin' && (
          <Card style={styles.statsCard}>
            <View style={styles.statsGrid}>
              <View style={styles.statsItem}>
                <Text style={[styles.statsValue, { color: colors.text }]}>
                  {employees.length}
                </Text>
                <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>
                  Total
                </Text>
              </View>
              
              <View style={[styles.statsDivider, { backgroundColor: colors.border }]} />
              
              <View style={styles.statsItem}>
                <Text style={[styles.statsValue, { color: colors.text }]}>
                  {employees.filter(e => e.department === 'Engineering').length}
                </Text>
                <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>
                  Engineering
                </Text>
              </View>
              
              <View style={[styles.statsDivider, { backgroundColor: colors.border }]} />
              
              <View style={styles.statsItem}>
                <Text style={[styles.statsValue, { color: colors.text }]}>
                  {employees.filter(e => e.department === 'Marketing').length}
                </Text>
                <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>
                  Marketing
                </Text>
              </View>
            </View>
          </Card>
        )}
        
        {/* Add Employee Button - Only show if admin */}
        {user?.role === 'admin' && (
          <Button
            title="Add New Employee"
            onPress={handleAddEmployee}
            leftIcon={<Plus size={18} color={colors.white} />}
            style={styles.addButton}
          />
        )}
        
        {/* Employees List */}
        <View style={styles.employeesList}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Employee Directory
          </Text>
          
          {isLoading ? (
            <Card style={styles.loadingCard}>
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                Loading employees...
              </Text>
            </Card>
          ) : filteredEmployees.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {searchQuery ? `No employees found matching "${searchQuery}"` : 'No employees found'}
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
  statsCard: {
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statsItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  statsDivider: {
    width: 1,
    height: 30,
  },
  statsValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
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
  loadingCard: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  emptyCard: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
});