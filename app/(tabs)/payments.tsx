import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { Button } from "@/components/Button";
import { InputField } from "@/components/InputField";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { Colors, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useFintech } from "@/hooks/useFintech";
import { useAsync } from "@/hooks/useAsync";

/**
 * Payments Screen.
 * Implements robust transaction handling and status feedback.
 */
export default function Payments() {
  const [amount, setAmount] = useState("");
  const [to, setTo] = useState("");
  
  const fintech = useFintech();
  const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const themeColors = Colors[colorScheme];

  // Wrapped transaction logic
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
        Alert.alert("Failed", "Transaction declined. Please check your balance.");
      }
    } catch (error: any) {
      Alert.alert("Transaction Error", error.message || "An error occurred during transfer.");
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
          <Text style={[styles.title, { color: themeColors.text }]}>Send Money</Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>Safe, instant, and borderless transfers.</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <View style={styles.form}>
            <InputField
              label="Recipient Handle or Name"
              placeholder="e.g. John Doe"
              value={to}
              onChangeText={setTo}
              icon="person-outline"
            />

            <InputField
              label="Transaction Amount (₹)"
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
                  title={`₹${val}`}
                  onPress={() => setAmount(val.toString())}
                  style={styles.quickBtn}
                  textStyle={styles.quickBtnText}
                />
              ))}
            </View>

            <Button 
              title="Transfer Now" 
              onPress={handleSend}
              disabled={loading || !amount || !to}
              style={styles.mainButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    // Global horizontal padding handled by ScreenWrapper
  },
  container: {
    flex: 1,
  },
  header: {
    marginTop: Spacing.four,
    marginBottom: Spacing.five,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  scroll: {
    paddingBottom: 100,
  },
  form: {
    gap: Spacing.four,
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
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
    paddingVertical: 10,
    width: '23%',
    borderRadius: 12,
  },
  quickBtnText: {
    color: '#007AFF',
    fontSize: 13,
    fontWeight: '700',
  },
  mainButton: {
    marginTop: Spacing.two,
    height: 60,
    borderRadius: 18,
  },
});
