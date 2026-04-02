import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, RefreshControl, TouchableOpacity } from "react-native";
import { Transaction } from "../../src/providers/FintechProvider";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { TransactionCard } from "@/components/TransactionCard";
import { Colors, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useFintech } from "@/hooks/useFintech";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/useAuthStore";
import { router } from "expo-router";

/**
 * Main Wallet Dashboard.
 * Displays balance, premium card, and recent transaction history.
 */
export default function Wallet() {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const logout = useAuthStore((s) => s.logout);

  const fintech = useFintech();
  const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const themeColors = Colors[colorScheme];

  const fetchData = useCallback(async () => {
    try {
      const [bal, txs] = await Promise.all([
        fintech.getBalance(),
        fintech.getTransactions()
      ]);
      setBalance(bal);
      setTransactions(txs);
    } catch (error) {
      console.error("Failed to fetch wallet data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fintech]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  const handleLogout = () => {
    logout();
    router.replace("/(auth)/login");
  };

  return (
    <ScreenWrapper 
      withScroll 
      style={styles.wrapper}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh} 
          tintColor={themeColors.text}
        />
      }
    >
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={[styles.greeting, { color: themeColors.textSecondary }]}>Available Balance</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={22} color={themeColors.textSecondary} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.balance, { color: themeColors.text }]}>₹{balance.toLocaleString()}</Text>
      </View>

      {/* Premium Card UI Component */}
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

      {/* Transaction History Section */}
      <View style={styles.historyHeader}>
        <Text style={[styles.historyTitle, { color: themeColors.text }]}>History</Text>
        <Text style={{ color: '#007AFF', fontWeight: '600' }}>See All</Text>
      </View>

      <View style={styles.listContainer}>
        {loading ? (
          <Text style={[styles.statusText, { color: themeColors.textSecondary }]}>Loading history...</Text>
        ) : transactions.length > 0 ? (
          transactions.map(tx => <TransactionCard key={tx.id} transaction={tx} />)
        ) : (
          <Text style={[styles.statusText, { color: themeColors.textSecondary }]}>No recent activity.</Text>
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    // Global horizontal padding handled by ScreenWrapper
    paddingTop: Spacing.two,
  },
  header: {
    marginBottom: Spacing.four,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.one,
  },
  logoutBtn: {
    padding: Spacing.one,
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
    paddingBottom: 100,
  },
  statusText: {
    textAlign: 'center',
    marginTop: Spacing.four,
    fontSize: 14,
  },
});
