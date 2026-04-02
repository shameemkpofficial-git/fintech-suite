import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Transaction } from '../providers/FintechProvider';
import { Colors, Spacing } from '../constants/theme';
import { useColorScheme } from '../hooks/use-color-scheme';

interface TransactionCardProps {
  transaction: Transaction;
}

/**
 * Reusable Transaction History Card.
 * Consistent styling for transactions across screens.
 */
export const TransactionCard = ({ transaction }: TransactionCardProps) => {
  const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const themeColors = Colors[colorScheme];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isIncoming = transaction.type === 'incoming';

  return (
    <View style={[styles.card, { backgroundColor: themeColors.backgroundElement }]}>
      <View style={[styles.iconContainer, { backgroundColor: isIncoming ? '#E1F5E1' : '#F5E1E1' }]}>
        <Ionicons 
          name={isIncoming ? 'arrow-down' : 'arrow-up'} 
          size={20} 
          color={isIncoming ? '#2E7D32' : '#C62828'} 
        />
      </View>
      <View style={styles.info}>
        <Text style={[styles.to, { color: themeColors.text }]}>{transaction.to}</Text>
        <Text style={[styles.category, { color: themeColors.textSecondary }]}>
          {transaction.category} • {formatDate(transaction.date)}
        </Text>
      </View>
      <Text style={[styles.amount, { color: isIncoming ? '#2E7D32' : themeColors.text }]}>
        {isIncoming ? '+' : '-'}₹{transaction.amount.toLocaleString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: Spacing.three, 
    borderRadius: 16, 
    marginBottom: Spacing.two 
  },
  iconContainer: { 
    width: 44, 
    height: 44, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  info: { 
    flex: 1, 
    marginLeft: Spacing.three 
  },
  to: { 
    fontSize: 16, 
    fontWeight: '600' 
  },
  category: { 
    fontSize: 12, 
    marginTop: 2 
  },
  amount: { 
    fontSize: 16, 
    fontWeight: '700' 
  },
});
