import 'react-native-get-random-values';
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { OfflineBanner, UpdateBanner, AppBlurGuard } from "../src/shared/components";
import '../src/shared/i18n';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <AppBlurGuard>
        <OfflineBanner />
        <UpdateBanner />
        <Stack screenOptions={{ headerShown: false }} />
      </AppBlurGuard>
    </SafeAreaProvider>
  );
}
