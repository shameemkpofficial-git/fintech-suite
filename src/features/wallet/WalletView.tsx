import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, RefreshControl, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { ScreenWrapper } from "@/shared/components/ScreenWrapper";
import { ErrorView } from "@/shared/components/ErrorView";
import { EmptyState } from "@/shared/components/EmptyState";
import { Button } from "@/shared/components/Button";
import { Colors, Spacing } from "@/shared/constants/theme";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useFintech } from "@/shared/hooks/useFintech";
import { useAsync } from "@/shared/hooks/useAsync";
import { useAuthStore } from "@/features/auth/useAuthStore";
import { useSafeRequest } from "@/shared/hooks/useSafeRequest";
import { OfflineBanner } from "@/shared/components/OfflineBanner";
import { TransactionCard } from "./components/TransactionCard";

/**
 * WalletView Module.
 * Self-contained logic for the financial dashboard.
 */
export const WalletView = () => {
  const fintech = useFintech();
  const logout = useAuthStore((s) => s.logout);
  const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const themeColors = Colors[colorScheme];

  // Resilient data fetching with offline fallback and retries
  const { 
    execute: fetchBalance, 
    data: balance, 
    loading: loadingBalance, 
    isOfflineData: isBalanceOffline 
  } = useSafeRequest(fintech.getBalance, { cacheKey: 'balance' });

  const { 
    execute: fetchTransactions, 
    data: transactions = [], 
    loading: loadingTransactions, 
    isOfflineData: isTxOffline 
  } = useSafeRequest(fintech.getTransactions, { cacheKey: 'transactions' });

  const [refreshing, setRefreshing] = useState(false);

  const refreshAll = useCallback(async () => {
    await Promise.all([fetchBalance(), fetchTransactions()]);
  }, [fetchBalance, fetchTransactions]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshAll();
    setRefreshing(false);
  }, [refreshAll]);


  const handleLogout = () => {
    logout();
    router.replace("/(auth)/login");
  };

  const isLoading = loadingBalance || loadingTransactions;
  const hasError = false; // We can handle specific errors if needed

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
      <OfflineBanner />
      
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.statusRow}>
            <Text style={[styles.greeting, { color: themeColors.textSecondary }]}>Available Balance</Text>
            {isBalanceOffline && (
              <View style={styles.offlineBadge}>
                <Text style={styles.offlineBadgeText}>OFFLINE</Text>
              </View>
            )}
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={22} color={themeColors.textSecondary} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.balance, { color: themeColors.text }]}>
          ₹{(balance ?? 0).toLocaleString()}
        </Text>
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
        <View style={styles.statusRow}>
          <Text style={[styles.historyTitle, { color: themeColors.text }]}>History</Text>
          {isTxOffline && <Ionicons name="cloud-offline" size={16} color={themeColors.textSecondary} />}
        </View>
        <Text style={{ color: '#007AFF', fontWeight: '600' }}>See All</Text>
      </View>

      <View style={styles.listContainer}>
        {isLoading && !refreshing ? (
          <Text style={[styles.statusText, { color: themeColors.textSecondary }]}>Updating your wallet...</Text>
        ) : (transactions ?? []).length > 0 ? (
          (transactions ?? []).map(tx => <TransactionCard key={tx.id} transaction={tx} />)
        ) : (
          <EmptyState 
            icon="receipt-outline" 
            title="No Transactions" 
            description="You haven't made any payments yet. Tap 'Payments' to get started." 
          >
            <Button 
              title="Make Payment"
              onPress={() => router.push("/payments")} 
            />
          </EmptyState>
        )}
      </View>
    </ScreenWrapper>
  );
};


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
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  offlineBadge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  offlineBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
  statusText: {
    textAlign: 'center',
    marginTop: Spacing.four,
    fontSize: 14,
  },
});

