import { View, TextInput, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useState } from "react";
import { MockProvider } from "../../src/providers/MockProvider";
import { useAuthStore } from "../../src/store/useAuthStore";
import { router } from "expo-router";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { Button } from "@/components/Button";
import { Colors, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function Login() {
  const [phone, setPhone] = useState("");
  const setToken = useAuthStore((s) => s.setToken);
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  const handleLogin = async () => {
    if (phone.length < 10) return;
    const res = await MockProvider.login(phone);
    setToken(res.token);
    router.replace("/wallet");
  };

  return (
    <ScreenWrapper withGlassEffect style={styles.wrapper}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: themeColors.text }]}>FintechSuite</Text>
            <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>Secure your future, today.</Text>
          </View>

          <View style={styles.form}>
            <Text style={[styles.label, { color: themeColors.text }]}>Phone Number</Text>
            <TextInput
              placeholder="e.g. +91 9876543210"
              placeholderTextColor={themeColors.textSecondary}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={[styles.input, { 
                backgroundColor: themeColors.backgroundElement,
                color: themeColors.text
              }]}
            />
            <Button 
              title="Get Started" 
              onPress={handleLogin} 
              disabled={phone.length < 10}
              style={styles.button}
            />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    // Standard horizontal padding is now handled by ScreenWrapper
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    marginBottom: Spacing.six,
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    marginTop: Spacing.one,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.two,
    marginLeft: Spacing.one,
  },
  input: {
    height: 56,
    borderRadius: 16,
    paddingHorizontal: Spacing.three,
    fontSize: 18,
    marginBottom: Spacing.four,
  },
  button: {
    height: 56,
    borderRadius: 16,
  },
});
