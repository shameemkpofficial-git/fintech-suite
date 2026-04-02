import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { MockProvider } from "../../src/providers/MockProvider";
import { Transaction } from "../../src/providers/FintechProvider";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { Colors, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";

export default function Wallet() {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    Promise.all([
      MockProvider.getBalance(),
      MockProvider.getTransactions()
    ]).then(([bal, txs]) => {
      setBalance(bal);
      setTransactions(txs);
    });
  }, []);

  const renderTransaction = (item: Transaction) => (
    <View key={item.id} style={[styles.txCard, { backgroundColor: themeColors.backgroundElement }]}>
      <View style={[styles.txIcon, { backgroundColor: item.type === 'incoming' ? '#E1F5E1' : '#F5E1E1' }]}>
        <Ionicons 
          name={item.type === 'incoming' ? 'arrow-down' : 'arrow-up'} 
          size={20} 
          color={item.type === 'incoming' ? '#2E7D32' : '#C62828'} 
        />
      </View>
      <View style={styles.txInfo}>
        <Text style={[styles.txTo, { color: themeColors.text }]}>{item.to}</Text>
        <Text style={[styles.txCat, { color: themeColors.textSecondary }]}>{item.category} • {formatDate(item.date)}</Text>
      </View>
      <Text style={[styles.txAmount, { color: item.type === 'incoming' ? '#2E7D32' : themeColors.text }]}>
        {item.type === 'incoming' ? '+' : '-'}₹{item.amount.toLocaleString()}
      </Text>
    </View>
  );

  return (
    <ScreenWrapper withScroll style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: themeColors.textSecondary }]}>My Balance</Text>
        <Text style={[styles.balance, { color: themeColors.text }]}>₹{balance.toLocaleString()}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: '#007AFF' }]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>FintechSuite Premium</Text>
          <Ionicons name="card-outline" size={24} color="#FFF" />
        </View>
        <View style={styles.cardNumber}>
          <Text style={styles.cardDots}>••••  ••••  •••• </Text>
          <Text style={styles.cardLast}>4242</Text>
        </View>
        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.cardLabel}>HOLDER</Text>
            <Text style={styles.cardValue}>SHAMEEM KP</Text>
          </View>
          <View style={styles.cardExp}>
            <Text style={styles.cardLabel}>EXP</Text>
            <Text style={styles.cardValue}>09/28</Text>
          </View>
        </View>
      </View>

      <View style={styles.historyHeader}>
        <Text style={[styles.historyTitle, { color: themeColors.text }]}>Transaction History</Text>
        <TouchableOpacity>
          <Text style={{ color: '#007AFF', fontWeight: '600' }}>See All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        {transactions.map(renderTransaction)}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
  },
  header: {
    marginBottom: Spacing.four,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '500',
  },
  balance: {
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: -1,
  },
  card: {
    height: 200,
    borderRadius: 24,
    padding: Spacing.four,
    justifyContent: 'space-between',
    marginBottom: Spacing.five,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    opacity: 0.8,
  },
  cardNumber: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardDots: {
    color: '#FFF',
    fontSize: 24,
    letterSpacing: 2,
    marginTop: 4,
  },
  cardLast: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: Spacing.two,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    color: '#FFF',
    fontSize: 10,
    opacity: 0.6,
    marginBottom: 4,
  },
  cardValue: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  cardExp: {
    alignItems: 'flex-end',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  listContainer: {
    gap: Spacing.two,
    paddingBottom: 100, // Space for tab bar
  },
  txCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: 16,
    marginBottom: Spacing.two,
  },
  txIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txInfo: {
    flex: 1,
    marginLeft: Spacing.three,
  },
  txTo: {
    fontSize: 16,
    fontWeight: '600',
  },
  txCat: {
    fontSize: 12,
    marginTop: 2,
  },
  txAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
});
