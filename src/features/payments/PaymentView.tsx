import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";

import { Button } from "@/shared/components/Button";
import { InputField } from "@/shared/components/InputField";
import { LoadingOverlay } from "@/shared/components/LoadingOverlay";
import { ScreenWrapper } from "@/shared/components/ScreenWrapper";
import { useAsync } from "@/shared/hooks/useAsync";
import { useFintech } from "@/shared/hooks/useFintech";
import { useStyles } from "@/shared/hooks/useStyles";
import { useTranslation } from "react-i18next";

/**
 * PaymentView Module.
 * Self-contained logic for peer-to-peer transfers.
 * Highly reusable for any screen or transaction flow.
 */
export const PaymentView = () => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState("");
  const [to, setTo] = useState("");

  const fintech = useFintech();
  const styles = useStyles((theme) => ({
    wrapper: {},
    container: {
      flex: 1,
    },
    header: {
      marginTop: theme.spacing.four,
      marginBottom: theme.spacing.five,
    },
    title: {
      fontSize: 28,
      fontWeight: '800',
      letterSpacing: -0.5,
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: 14,
      marginTop: 4,
      color: theme.colors.textSecondary,
    },
    scroll: {
      paddingBottom: 100,
    },
    form: {
      gap: theme.spacing.four,
    },
    amountInput: {
      fontSize: 24,
      fontWeight: '700',
    },
    quickAmounts: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    quickBtn: {
      paddingVertical: 10,
      paddingHorizontal: 0,
      width: '23%',
      borderRadius: 12,
    },
    quickBtnText: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.colors.tint,
    },
    mainButton: {
      marginTop: theme.spacing.two,
      height: 60,
      borderRadius: 18,
    },
  }));

  const sendAction = async (target: string, value: string) => {
    const numAmount = Number(value);
    if (isNaN(numAmount) || numAmount <= 0) throw new Error("Please enter a valid amount.");

    const success = await fintech.sendMoney(numAmount, target);
    if (success) {
      setAmount("");
      setTo("");
    }
    return success;
  };

  const { execute, loading } = useAsync(sendAction);

  const handleSend = async () => {
    if (!amount || !to) {
      Alert.alert("Input Required", "Please provide a recipient and amount.");
      return;
    }

    try {
      const success = await execute(to, amount);
      if (success) {
        Alert.alert("Success", `₹${amount} sent to ${to} successfully.`);
      } else {
        Alert.alert("Failed", "Transaction declined.");
      }
    } catch (error: any) {
      Alert.alert("Transaction Error", error.message || "An error occurred.");
    }
  };

  return (
    <ScreenWrapper withGlassEffect style={styles.wrapper}>
      <LoadingOverlay visible={loading} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{t('payments.title', 'Send Money')}</Text>
          <Text style={styles.subtitle}>{t('payments.subtitle', 'Safe and borderless transfers.')}</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <View style={styles.form}>
            <InputField
              label={t('payments.toLabel', 'Recipient Name')}
              placeholder="e.g. John Doe"
              value={to}
              onChangeText={setTo}
              icon="person-outline"
            />

            <InputField
              label={t('payments.amountLabel', 'Amount (₹)')}
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              icon="cash-outline"
              style={styles.amountInput}
            />

            <View style={styles.quickAmounts}>
              {[500, 1000, 2000, 5000].map((val) => (
                <Button
                  key={val}
                  title={`${val}`}
                  onPress={() => setAmount(val.toString())}
                  variant="outline"
                  style={styles.quickBtn}
                  textStyle={styles.quickBtnText}
                />
              ))}
            </View>

            <Button
              title={t('payments.sendNow', 'Transfer Now')}
              onPress={handleSend}
              disabled={loading || !amount || !to}
              style={styles.mainButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};
