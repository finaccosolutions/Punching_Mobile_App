import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Card from '@/components/ui/Card';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react-native';
import { format } from 'date-fns';

interface MonthSelectorProps {
  selectedMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export default function MonthSelector({
  selectedMonth,
  onPreviousMonth,
  onNextMonth,
}: MonthSelectorProps) {
  const { colors } = useTheme();
  
  const isCurrentMonth = () => {
    const now = new Date();
    return (
      selectedMonth.getMonth() === now.getMonth() &&
      selectedMonth.getFullYear() === now.getFullYear()
    );
  };
  
  return (
    <Card style={styles.card} variant="filled">
      <View style={styles.container}>
        <TouchableOpacity
          onPress={onPreviousMonth}
          style={[styles.arrowButton, { backgroundColor: colors.cardBackground }]}
        >
          <ChevronLeft size={20} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.monthDisplay}>
          <Calendar size={18} color={colors.primary} />
          <Text style={[styles.monthText, { color: colors.text }]}>
            {format(selectedMonth, 'MMMM yyyy')}
          </Text>
        </View>
        
        <TouchableOpacity
          onPress={onNextMonth}
          style={[
            styles.arrowButton, 
            { 
              backgroundColor: colors.cardBackground,
              opacity: isCurrentMonth() ? 0.5 : 1 
            }
          ]}
          disabled={isCurrentMonth()}
        >
          <ChevronRight size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  container: {
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
  monthDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
});