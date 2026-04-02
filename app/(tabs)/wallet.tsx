import { View, Text } from "react-native";
import { useEffect, useState } from "react";
import { MockProvider } from "../../src/providers/MockProvider";

export default function Wallet() {
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    MockProvider.getBalance().then(setBalance);
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Balance: ₹{balance}</Text>
    </View>
  );
}
