import React, { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import { router } from "expo-router";

import { ScreenWrapper } from "@/shared/components/ScreenWrapper";
import { Button } from "@/shared/components/Button";
import { InputField } from "@/shared/components/InputField";
import { LoadingOverlay } from "@/shared/components/LoadingOverlay";
import { Colors, Spacing } from "@/shared/constants/theme";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useFintech } from "@/shared/hooks/useFintech";
import { useAsync } from "@/shared/hooks/useAsync";
import { useAuthStore } from "./useAuthStore";

/**
 * LoginView Module.
 * Completely self-contained authentication interface.
 * Implements hardened session persistence and standardized loading states.
 */
export const LoginView = () => {
  const [phone, setPhone] = useState("");
  const setToken = useAuthStore((s) => s.setToken);
  const fintech = useFintech();
  
  const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const themeColors = Colors[colorScheme];

  const loginAction = async (phoneNumber: string) => {
    const res = await fintech.login(phoneNumber);
    setToken(res.token);
    router.replace("/(tabs)/wallet");
    return res;
  };

  const { execute, loading } = useAsync(loginAction);

  const handleLogin = async () => {
    if (phone.length < 10) return;
    
    try {
      await execute(phone);
    } catch (error: any) {
      Alert.alert("Authentication Error", error.message || "Could not verify your identity.");
    }
  };

  return (
    <ScreenWrapper withGlassEffect style={styles.wrapper}>
      <LoadingOverlay visible={loading} />
      
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: themeColors.text }]}>FintechSuite</Text>
            <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>Secure your financial future.</Text>
          </View>

          <View style={styles.form}>
            <InputField
              label="Phone Number"
              placeholder="e.g. +91 9876543210"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              icon="call-outline"
            />
            
            <Button 
              title="Get Started"
              onPress={handleLogin} 
              disabled={phone.length < 10}
              loading={loading}
              style={styles.button}
            />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    // Global horizontal padding handled by ScreenWrapper
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
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    marginTop: Spacing.one,
  },
  form: {
    width: '100%',
  },
  button: {
    height: 56,
    borderRadius: 16,
    marginTop: Spacing.two,
  },
});
