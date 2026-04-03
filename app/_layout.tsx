import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { OfflineBanner, UpdateBanner } from "../src/shared/components";

export default function Layout() {
  return (
    <SafeAreaProvider>
      <OfflineBanner />
      <UpdateBanner />
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
