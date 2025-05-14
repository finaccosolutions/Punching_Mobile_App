import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Check, FileText, User, Clock, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { PayrollItem } from '@/services/payrollService';

interface PayrollItemCardProps {
  payrollItem: PayrollItem;
}

export default function PayrollItemCard({ payrollItem }: PayrollItemCardProps) {
  const { colors } = useTheme();
  
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };
  
  const getStatusColor = () => {
    switch (payrollItem.status) {
      case 'pending':
        return colors.warning;
      case 'processed':
        return colors.info;
      case 'paid':
        return colors.success;
      default:
        return colors.textSecondary;
    }
  };
  
  const getStatusIcon = () => {
    switch (payrollItem.status) {
      case 'pending':
        return <Clock size={16} color={colors.warning} />;
      case 'processed':
        return <AlertTriangle size={16} color={colors.info} />;
      case 'paid':
        return <Check size={16} color={colors.success} />;
      default:
        return null;
    }
  };
  
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.employeeInfo}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight }]}>
            <User size={20} color={colors.primary} />
          </View>
          <View>
            <Text style={[styles.employeeName, { color: colors.text }]}>
              {payrollItem.employeeName}
            </Text>
            <Text style={[styles.payPeriod, { color: colors.textSecondary }]}>
              Pay Period: {payrollItem.period.replace('-', '/')}
            </Text>
          </View>
        </View>
        
        <View style={[
          styles.statusBadge, 
          { backgroundColor: getStatusColor() + '20' }
        ]}>
          {getStatusIcon()}
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {payrollItem.status.charAt(0).toUpperCase() + payrollItem.status.slice(1)}
          </Text>
        </View>
      </View>
      
      <View style={styles.amountContainer}>
        <View style={styles.amountColumn}>
          <Text style={[styles.amountLabel, { color: colors.textSecondary }]}>
            Base Salary
          </Text>
          <Text style={[styles.amountValue, { color: colors.text }]}>
            {formatCurrency(payrollItem.baseSalary)}
          </Text>
        </View>
        
        <View style={styles.amountColumn}>
          <Text style={[styles.amountLabel, { color: colors.textSecondary }]}>
            Deductions
          </Text>
          <Text style={[styles.amountValue, { color: colors.error }]}>
            -{formatCurrency(payrollItem.deductions + payrollItem.taxes)}
          </Text>
        </View>
        
        <View style={styles.amountColumn}>
          <Text style={[styles.amountLabel, { color: colors.textSecondary }]}>
            Net Salary
          </Text>
          <Text style={[styles.netValue, { color: colors.success }]}>
            {formatCurrency(payrollItem.netSalary)}
          </Text>
        </View>
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={[styles.viewDetailsButton, { borderColor: colors.border }]}>
          <FileText size={16} color={colors.primary} />
          <Text style={[styles.viewDetailsText, { color: colors.primary }]}>
            View Details
          </Text>
        </TouchableOpacity>
        
        {payrollItem.status === 'pending' && (
          <Button
            title="Process"
            variant="outline"
            size="small"
            onPress={() => {}}
            leftIcon={<Check size={14} color={colors.primary} />}
            style={styles.processButton}
          />
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  employeeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  employeeName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  payPeriod: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  amountContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  amountColumn: {
    flex: 1,
  },
  amountLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  netValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    paddingTop: 12,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
  },
  viewDetailsText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  processButton: {
    paddingHorizontal: 12,
  },
});