import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

import { ScreenWrapper } from "@/shared/components/ScreenWrapper";
import { Button } from "@/shared/components/Button";
import { InputField } from "@/shared/components/InputField";
import { LoadingOverlay } from "@/shared/components/LoadingOverlay";
import { Colors, Spacing } from "@/shared/constants/theme";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useFintech } from "@/shared/hooks/useFintech";
import { useAsync } from "@/shared/hooks/useAsync";
import { useAuthStore } from "./useAuthStore";
import { useBiometrics } from "@/shared/hooks/useBiometrics";

/**
 * LoginView Module.
 * Completely self-contained authentication interface.
 * Implements hardened session persistence and standardized loading states.
 */
export const LoginView = () => {
  const { t } = useTranslation();
  const [phone, setPhone] = useState("");
  const { setToken, lastPhone, _hasHydrated } = useAuthStore((s) => ({
    setToken: s.setToken,
    lastPhone: s.lastPhone,
    _hasHydrated: s._hasHydrated,
  }));
  const fintech = useFintech();
  const { isCompatible, isEnrolled, authenticate } = useBiometrics();
  
  const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const themeColors = Colors[colorScheme];

  useEffect(() => {
    // Prefill last phone if available
    if (_hasHydrated && lastPhone) {
      setPhone(lastPhone);
    }
  }, [_hasHydrated, lastPhone]);

  const loginAction = async (phoneNumber: string) => {
    const res = await fintech.login(phoneNumber);
    setToken(res.token, phoneNumber);
    router.replace("/(tabs)/wallet");
    return res;
  };

  const { execute, loading } = useAsync(loginAction);

  const handleLogin = async () => {
    if (phone.length < 10) return;
    
    try {
      await execute(phone);
    } catch (error: any) {
      Alert.alert(t('auth.errorTitle'), error.message || t('auth.errorMessage'));
    }
  };

  const handleBiometricLogin = async () => {
    const success = await authenticate(t('auth.biometricPrompt'));
    if (success && lastPhone) {
      await execute(lastPhone);
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
            <Text style={[styles.title, { color: themeColors.text }]}>{t('auth.title')}</Text>
            <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>{t('auth.subtitle')}</Text>
          </View>

          <View style={styles.form}>
            <InputField
              label={t('auth.phoneLabel')}
              placeholder={t('auth.phonePlaceholder')}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              icon="call-outline"
            />
            
            <Button 
              title={t('auth.getStarted')}
              onPress={handleLogin} 
              disabled={phone.length < 10}
              loading={loading}
              style={styles.button}
            />

            {isCompatible && isEnrolled && lastPhone && (
              <Button 
                title={t('auth.biometricLogin')}
                onPress={handleBiometricLogin}
                variant="outline"
                style={styles.biometricButton}
              />
            )}
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
  biometricButton: {
    height: 56,
    borderRadius: 16,
    marginTop: Spacing.two,
  },
});
