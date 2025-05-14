import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Card from '@/components/ui/Card';
import { DollarSign, TriangleAlert as AlertTriangle, Check, Clock } from 'lucide-react-native';

interface PayrollSummaryProps {
  pendingCount: number;
  processedCount: number;
  paidCount: number;
  totalAmount: number;
}

export default function PayrollSummary({
  pendingCount,
  processedCount,
  paidCount,
  totalAmount,
}: PayrollSummaryProps) {
  const { colors } = useTheme();
  
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };
  
  return (
    <Card style={styles.card}>
      <View style={styles.totalContainer}>
        <View style={styles.totalTextContainer}>
          <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>
            Total Payroll Amount
          </Text>
          <Text style={[styles.totalAmount, { color: colors.text }]}>
            {formatCurrency(totalAmount)}
          </Text>
        </View>
        
        <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight }]}>
          <DollarSign size={24} color={colors.primary} />
        </View>
      </View>
      
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: colors.warningLight }]}>
            <Clock size={16} color={colors.warning} />
          </View>
          <Text style={[styles.statValue, { color: colors.text }]}>{pendingCount}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Pending</Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: colors.infoLight }]}>
            <AlertTriangle size={16} color={colors.info} />
          </View>
          <Text style={[styles.statValue, { color: colors.text }]}>{processedCount}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Processed</Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: colors.successLight }]}>
            <Check size={16} color={colors.success} />
          </View>
          <Text style={[styles.statValue, { color: colors.text }]}>{paidCount}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Paid</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalTextContainer: {},
  totalLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
});