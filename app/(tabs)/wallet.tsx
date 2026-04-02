import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, RefreshControl, TouchableOpacity } from "react-native";
import { Transaction } from "../../src/providers/FintechProvider";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { TransactionCard } from "@/components/TransactionCard";
import { ErrorView } from "@/components/ErrorView";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/Button";
import { Colors, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useFintech } from "@/hooks/useFintech";
import { useAsync } from "@/hooks/useAsync";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/useAuthStore";
import { router } from "expo-router";

/**
 * Main Wallet Dashboard.
 * Displays balance, premium card, and recent transaction history.
 * Implements robust loading, error handling, and retry logic.
 */
export default function Wallet() {
  const fintech = useFintech();
  const logout = useAuthStore((s) => s.logout);
  const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const themeColors = Colors[colorScheme];

  // Logic for fetching both balance and transactions
  const fetchDataFn = useCallback(() => Promise.all([
    fintech.getBalance(),
    fintech.getTransactions()
  ]), [fintech]);

  const { execute, loading, error, data } = useAsync(fetchDataFn);
  const [refreshing, setRefreshing] = useState(false);

  const initialFetch = useCallback(async () => {
    await execute();
  }, [execute]);

  useEffect(() => {
    initialFetch();
  }, [initialFetch]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await execute();
    setRefreshing(false);
  }, [execute]);

  const handleLogout = () => {
    logout();
    router.replace("/(auth)/login");
  };

  const balance = data?.[0] ?? 0;
  const transactions = data?.[1] ?? [];

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

      {/* Persistence Error Handling & Retry */}
      {error ? (
        <ErrorView message={error} onRetry={execute} />
      ) : (
        <>
          {/* Card Component */}
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

          {/* Transactions List */}
          <View style={styles.historyHeader}>
            <Text style={[styles.historyTitle, { color: themeColors.text }]}>History</Text>
            <Text style={{ color: '#007AFF', fontWeight: '600' }}>See All</Text>
          </View>

          <View style={styles.listContainer}>
            {loading && !refreshing ? (
              <Text style={[styles.statusText, { color: themeColors.textSecondary }]}>Updating your wallet...</Text>
            ) : transactions.length > 0 ? (
              transactions.map(tx => <TransactionCard key={tx.id} transaction={tx} />)
            ) : (
              <EmptyState 
                icon="receipt-outline" 
                title="No Transactions" 
                description="You haven't made any payments yet. Tap 'Payments' to get started." 
              >
                <Button 
                  title="Get Started"
                  onPress={() => router.push("/payments")} 
                  loading={loading}
                />
              </EmptyState>
            )}
          </View>
        </>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
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
