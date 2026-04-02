import { Redirect } from "expo-router";
import { useAuthStore } from "../src/store/useAuthStore";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const token = useAuthStore((s) => s.token);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);

  if (!hasHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!token) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(tabs)/wallet" />;
}
