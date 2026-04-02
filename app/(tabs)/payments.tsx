import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { Button } from "@/components/Button";
import { InputField } from "@/components/InputField";
import { Colors, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useFintech } from "@/hooks/useFintech";

/**
 * Payments Screen.
 * Allows users to send money via the Fintech Provider.
 */
export default function Payments() {
  const [amount, setAmount] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  
  const fintech = useFintech();
  const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const themeColors = Colors[colorScheme];

  const handleSend = async () => {
    if (!amount || !to) {
      Alert.alert("Input Required", "Please provide a recipient and amount.");
      return;
    }
    
    setLoading(true);
    try {
      const numAmount = Number(amount);
      if (isNaN(numAmount) || numAmount <= 0) throw new Error("Invalid amount.");

      const success = await fintech.sendMoney(numAmount, to);
      
      if (success) {
        Alert.alert("Success", `₹${numAmount} successfully sent to ${to}`);
        setAmount("");
        setTo("");
      } else {
        Alert.alert("Failed", "Transaction declined. Please try again later.");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "An error occurred during transaction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper withGlassEffect style={styles.wrapper}>
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
              title={loading ? "Processing..." : "Transfer Now"} 
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
