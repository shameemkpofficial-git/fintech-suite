import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Transaction } from '@/shared/api/FintechProvider';
import { Colors, Spacing } from '@/shared/constants/theme';
import { useColorScheme } from '@/shared/hooks/use-color-scheme';

interface TransactionCardProps {
  transaction: Transaction;
}

/**
 * Reusable Transaction Item Card.
 * Standardized presentation for financial history items.
 */
export const TransactionCard = ({ transaction }: TransactionCardProps) => {
  const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const themeColors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: themeColors.backgroundElement }]}>
      <View style={[styles.iconContainer, { backgroundColor: themeColors.backgroundSelected }]}>
        <Ionicons 
          name={transaction.type === 'incoming' ? 'arrow-down-outline' : 'arrow-up-outline'} 
          size={20} 
          color={transaction.type === 'incoming' ? '#2E7D32' : '#C62828'} 
        />
      </View>
      <View style={styles.content}>
        <Text style={[styles.to, { color: themeColors.text }]}>{transaction.to}</Text>
        <Text style={[styles.date, { color: themeColors.textSecondary }]}>{transaction.category}</Text>
      </View>
      <View style={styles.amountContainer}>
        <Text style={[
          styles.amount, 
          { color: transaction.type === 'incoming' ? '#2E7D32' : themeColors.text }
        ]}>
          {transaction.type === 'incoming' ? '+' : '-'} ₹{transaction.amount.toLocaleString()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: 16,
    marginBottom: Spacing.one,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.three,
  },
  content: {
    flex: 1,
  },
  to: {
    fontSize: 16,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    marginTop: 2,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
});
