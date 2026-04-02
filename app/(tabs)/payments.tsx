import { View, TextInput, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useState } from "react";
import { MockProvider } from "../../src/providers/MockProvider";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { Button } from "@/components/Button";
import { Colors, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";

export default function Payments() {
  const [amount, setAmount] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  const handleSend = async () => {
    if (!amount || !to) {
      Alert.alert("Error", "Please enter both recipient and amount");
      return;
    }
    
    setLoading(true);
    const success = await MockProvider.sendMoney(Number(amount), to);
    setLoading(false);
    
    if (success) {
      Alert.alert("Success", `₹${amount} sent to ${to}`);
      setAmount("");
      setTo("");
    } else {
      Alert.alert("Failed", "Transaction could not be completed at this time.");
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
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>Instant, secure transfers to anyone.</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: themeColors.textSecondary }]}>Recipient Name or ID</Text>
              <View style={[styles.inputContainer, { backgroundColor: themeColors.backgroundElement }]}>
                <Ionicons name="person-outline" size={20} color={themeColors.textSecondary} style={styles.icon} />
                <TextInput
                  placeholder="e.g. John Doe"
                  placeholderTextColor={themeColors.textSecondary}
                  value={to}
                  onChangeText={setTo}
                  style={[styles.input, { color: themeColors.text }]}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: themeColors.textSecondary }]}>Amount (₹)</Text>
              <View style={[styles.inputContainer, { backgroundColor: themeColors.backgroundElement }]}>
                <Ionicons name="cash-outline" size={20} color={themeColors.textSecondary} style={styles.icon} />
                <TextInput
                  placeholder="0.00"
                  placeholderTextColor={themeColors.textSecondary}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  style={[styles.input, { color: themeColors.text, fontSize: 24, fontWeight: '700' }]}
                />
              </View>
            </View>

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
              title={loading ? "Processing..." : "Send Securely"} 
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
    // Standard horizontal padding is now handled by ScreenWrapper
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
  inputGroup: {
    gap: Spacing.two,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: Spacing.one,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    borderRadius: 16,
    paddingHorizontal: Spacing.three,
  },
  icon: {
    marginRight: Spacing.two,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  quickAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.one,
  },
  quickBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
    paddingVertical: 10,
    width: '22%',
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
