import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  DollarSign, 
  Calendar, 
  FileText, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Check,
  Clock
} from 'lucide-react-native';
import { getAllPayrollItems, PayrollItem } from '@/services/payrollService';
import { format, subMonths } from 'date-fns';
import PayrollItemCard from '@/components/payroll/PayrollItemCard';
import PayrollSummary from '@/components/payroll/PayrollSummary';

export default function PayrollScreen() {
  const { colors } = useTheme();
  
  const [payrollItems, setPayrollItems] = useState<PayrollItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<PayrollItem[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  
  const selectedPeriod = format(selectedMonth, 'MM-yyyy');
  
  useEffect(() => {
    const fetchPayroll = async () => {
      try {
        setIsLoading(true);
        const data = await getAllPayrollItems();
        setPayrollItems(data);
      } catch (error) {
        console.error('Error fetching payroll data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPayroll();
  }, []);
  
  useEffect(() => {
    // Filter by selected month
    const filtered = payrollItems.filter(item => item.period === selectedPeriod);
    setFilteredItems(filtered);
  }, [selectedPeriod, payrollItems]);
  
  const handlePreviousMonth = () => {
    setSelectedMonth(prevMonth => subMonths(prevMonth, 1));
  };
  
  const handleNextMonth = () => {
    const nextMonth = new Date(selectedMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    // Don't allow selecting future months
    if (nextMonth <= new Date()) {
      setSelectedMonth(nextMonth);
    }
  };
  
  const getPendingCount = () => {
    return filteredItems.filter(item => item.status === 'pending').length;
  };
  
  const getProcessedCount = () => {
    return filteredItems.filter(item => item.status === 'processed').length;
  };
  
  const getPaidCount = () => {
    return filteredItems.filter(item => item.status === 'paid').length;
  };
  
  const getTotalAmount = () => {
    return filteredItems.reduce((sum, item) => sum + item.netSalary, 0);
  };
  
  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Payroll
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Manage employee compensation
        </Text>
      </View>
      
      {/* Month Selector */}
      <Card style={styles.periodCard} variant="filled">
        <View style={styles.periodSelector}>
          <TouchableOpacity 
            onPress={handlePreviousMonth}
            style={[styles.arrowButton, { backgroundColor: colors.cardBackground }]}
          >
            <ChevronLeft size={20} color={colors.text} />
          </TouchableOpacity>
          
          <View style={styles.periodDisplay}>
            <Calendar size={18} color={colors.primary} />
            <Text style={[styles.periodText, { color: colors.text }]}>
              {format(selectedMonth, 'MMMM yyyy')}
            </Text>
          </View>
          
          <TouchableOpacity 
            onPress={handleNextMonth}
            style={[
              styles.arrowButton, 
              { 
                backgroundColor: colors.cardBackground,
                opacity: format(new Date(), 'MM-yyyy') === selectedPeriod ? 0.5 : 1 
              }
            ]}
            disabled={format(new Date(), 'MM-yyyy') === selectedPeriod}
          >
            <ChevronRight size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </Card>
      
      {/* Payroll Summary */}
      <PayrollSummary 
        pendingCount={getPendingCount()}
        processedCount={getProcessedCount()}
        paidCount={getPaidCount()}
        totalAmount={getTotalAmount()}
      />
      
      {/* Actions */}
      <View style={styles.actionsContainer}>
        <Button
          title="Generate Payroll"
          onPress={() => {}}
          leftIcon={<Plus size={18} color={colors.white} />}
          style={{ flex: 1 }}
        />
        
        <Button
          title="Process All"
          variant="secondary"
          onPress={() => {}}
          leftIcon={<Check size={18} color={colors.white} />}
          style={{ flex: 1 }}
          disabled={getPendingCount() === 0}
        />
      </View>
      
      {/* Payroll Items */}
      <View style={styles.payrollList}>
        <View style={styles.listHeader}>
          <Text style={[styles.listTitle, { color: colors.text }]}>
            Payroll Items
          </Text>
          
          <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.cardBackgroundAlt }]}>
            <Filter size={16} color={colors.primary} />
            <Text style={[styles.filterText, { color: colors.primary }]}>Filter</Text>
          </TouchableOpacity>
        </View>
        
        {isLoading ? (
          <Card style={styles.messageCard}>
            <View style={styles.messageContent}>
              <Clock size={20} color={colors.primary} />
              <Text style={[styles.messageText, { color: colors.textSecondary }]}>
                Loading payroll data...
              </Text>
            </View>
          </Card>
        ) : filteredItems.length === 0 ? (
          <Card style={styles.messageCard}>
            <View style={styles.messageContent}>
              <FileText size={20} color={colors.textSecondary} />
              <Text style={[styles.messageText, { color: colors.textSecondary }]}>
                No payroll items found for this period
              </Text>
            </View>
          </Card>
        ) : (
          filteredItems.map(item => (
            <PayrollItemCard key={item.id} payrollItem={item} />
          ))
        )}
      </View>
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
  periodCard: {
    marginBottom: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrowButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  periodDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  periodText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  payrollList: {
    marginBottom: 16,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  filterText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  messageCard: {
    padding: 24,
    alignItems: 'center',
  },
  messageContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
});