import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Card from '@/components/ui/Card';
import { Phone, Mail, Calendar, Briefcase, ChevronRight } from 'lucide-react-native';
import { Employee } from '@/services/employeeService';
import { format, parseISO } from 'date-fns';

interface EmployeeListItemProps {
  employee: Employee;
}

export default function EmployeeListItem({ employee }: EmployeeListItemProps) {
  const { colors } = useTheme();
  
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMM d, yyyy');
  };
  
  return (
    <TouchableOpacity>
      <Card style={styles.card}>
        <View style={styles.container}>
          <View style={styles.avatarContainer}>
            {employee.avatar ? (
              <Image source={{ uri: employee.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primaryLight }]} />
            )}
          </View>
          
          <View style={styles.infoContainer}>
            <Text style={[styles.name, { color: colors.text }]}>
              {employee.name}
            </Text>
            
            <View style={styles.positionContainer}>
              <Briefcase size={14} color={colors.primary} />
              <Text style={[styles.position, { color: colors.textSecondary }]}>
                {employee.position}
              </Text>
            </View>
            
            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <Mail size={14} color={colors.textSecondary} />
                <Text style={[styles.detailText, { color: colors.text }]} numberOfLines={1}>
                  {employee.email}
                </Text>
              </View>
              
              <View style={styles.detailItem}>
                <Phone size={14} color={colors.textSecondary} />
                <Text style={[styles.detailText, { color: colors.text }]}>
                  {employee.phoneNumber}
                </Text>
              </View>
              
              <View style={styles.detailItem}>
                <Calendar size={14} color={colors.textSecondary} />
                <Text style={[styles.detailText, { color: colors.text }]}>
                  Joined {formatDate(employee.joiningDate)}
                </Text>
              </View>
            </View>
          </View>
          
          <ChevronRight size={20} color={colors.textSecondary} />
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  positionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  position: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  detailsContainer: {
    gap: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginLeft: 4,
  },
});