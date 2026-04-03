import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useAuthStore } from "@/features/auth/useAuthStore";
import {
  AnimatedCard,
  Button,
  EmptyState,
  OfflineBanner,
  ScreenWrapper
} from "@/shared/components";
import { Colors, Spacing } from "@/shared/constants/theme";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useFintech } from "@/shared/hooks/useFintech";
import { useSafeRequest } from "@/shared/hooks/useSafeRequest";
import { useTranslation } from "react-i18next";
import { useStyles } from "@/shared/hooks/useStyles";
import { TransactionCard } from "./components/TransactionCard";

/**
 * WalletView Module.
 * Self-contained logic for the financial dashboard.
 */
export const WalletView = () => {
  const { t } = useTranslation();
  const fintech = useFintech();
  const logout = useAuthStore((s) => s.logout);
  const styles = useStyles((theme) => ({
    wrapper: {
      paddingTop: theme.spacing.two,
    },
    header: {
      marginBottom: theme.spacing.four,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.one,
    },
    logoutBtn: {
      padding: theme.spacing.one,
    },
    greeting: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.textSecondary,
    },
    balance: {
      fontSize: 42,
      fontWeight: '800',
      letterSpacing: -1,
      color: theme.colors.text,
    },
    card: {
      height: 200,
      borderRadius: 24,
      padding: theme.spacing.four,
      justifyContent: 'space-between',
      marginBottom: theme.spacing.five,
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
      marginLeft: theme.spacing.two,
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
      marginBottom: theme.spacing.three,
    },
    historyTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.text,
    },
    listContainer: {
      gap: theme.spacing.two,
      paddingBottom: 100,
    },
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.one,
    },
    offlineBadge: {
      backgroundColor: theme.colors.danger,
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
      marginTop: theme.spacing.four,
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
  }));

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

  return (
    <ScreenWrapper
      withScroll
      style={styles.wrapper}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      <OfflineBanner />

      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.statusRow}>
            <Text style={styles.greeting}>{t('wallet.availableBalance', 'Available Balance')}</Text>
            {isBalanceOffline && (
              <View style={styles.offlineBadge}>
                <Text style={styles.offlineBadgeText}>{t('common.offline', 'OFFLINE')}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={22} color={styles.greeting.color} />
          </TouchableOpacity>
        </View>
        <Text style={styles.balance}>
          ₹{(balance ?? 0).toLocaleString()}
        </Text>
      </View>

      <AnimatedCard variant="glass" style={StyleSheet.flatten([styles.card, { backgroundColor: '#007AFF' }])}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{t('wallet.cardName', 'FintechSuite Premium')}</Text>
          <Ionicons name="card-outline" size={24} color="#FFF" />
        </View>
        <View style={styles.cardNumber}>
          <Text style={styles.cardDots}>••••  ••••  •••• </Text>
          <Text style={styles.cardLast}>4242</Text>
        </View>
        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.cardLabel}>{t('wallet.cardHolder', 'HOLDER')}</Text>
            <Text style={styles.cardValue}>SHAMEEM KP</Text>
          </View>
          <View style={styles.cardExp}>
            <Text style={styles.cardLabel}>{t('wallet.cardExp', 'EXP')}</Text>
            <Text style={styles.cardValue}>09/28</Text>
          </View>
        </View>
      </AnimatedCard>

      <View style={styles.historyHeader}>
        <View style={styles.statusRow}>
          <Text style={styles.historyTitle}>{t('wallet.history', 'History')}</Text>
          {isTxOffline && <Ionicons name="cloud-offline" size={16} color={styles.greeting.color} />}
        </View>
        <Text style={{ color: '#007AFF', fontWeight: '600' }}>{t('wallet.seeAll', 'See All')}</Text>
      </View>

      <View style={styles.listContainer}>
        {isLoading && !refreshing ? (
          <Text style={styles.statusText}>{t('wallet.updating', 'Updating your wallet...')}</Text>
        ) : (transactions ?? []).length > 0 ? (
          (transactions ?? []).map((tx, index) => (
            <AnimatedCard key={tx.id} variant="outline" delay={index * 100} style={{ padding: 0 }}>
              <TransactionCard transaction={tx} />
            </AnimatedCard>
          ))
        ) : (
          <EmptyState
            icon="receipt-outline"
            title={t('wallet.noTransactions', 'No Transactions')}
            description={t('wallet.noTransactionsDesc', "You haven't made any payments yet. Tap 'Payments' to get started.")}
          >
            <Button
              title={t('wallet.makePayment', 'Make Payment')}
              onPress={() => router.push("/payments")}
            />
          </EmptyState>
        )}
      </View>
    </ScreenWrapper>
  );
};

