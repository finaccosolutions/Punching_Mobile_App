import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import { Users, DollarSign, ClipboardList, ChartBar as BarChart3 } from 'lucide-react-native';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  
  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.welcomeText, { color: colors.text }]}>
          Welcome back,
        </Text>
        <Text style={[styles.nameText, { color: colors.text }]}>
          {user?.name}
        </Text>
        <Text style={[styles.roleText, { color: colors.textSecondary }]}>
          {user?.role === 'admin' ? 'Administrator' : 'Employee'}
        </Text>
      </View>

      {user?.role === 'admin' && (
        <View style={styles.quickStats}>
          <Card style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight }]}>
              <Users size={24} color={colors.primary} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>24</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Employees</Text>
          </Card>

          <Card style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: colors.successLight }]}>
              <ClipboardList size={24} color={colors.success} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>89%</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Attendance</Text>
          </Card>

          <Card style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: colors.warningLight }]}>
              <DollarSign size={24} color={colors.warning} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>$45k</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Payroll</Text>
          </Card>

          <Card style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: colors.infoLight }]}>
              <BarChart3 size={24} color={colors.info} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>15</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Reports</Text>
          </Card>
        </View>
      )}

      <Card style={styles.summaryCard}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          Quick Summary
        </Text>
        <Text style={[styles.cardText, { color: colors.textSecondary }]}>
          {user?.role === 'admin' 
            ? 'Monitor your organization\'s performance and manage employee data efficiently.'
            : 'Track your attendance, view payroll information, and access important reports.'}
        </Text>
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
  },
  header: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  nameText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  roleText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  quickStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  summaryCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
});