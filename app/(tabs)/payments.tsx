import { View, TextInput, Button, Alert } from "react-native";
import { useState } from "react";
import { MockProvider } from "../../src/providers/MockProvider";

export default function Payments() {
  const [amount, setAmount] = useState("");
  const [to, setTo] = useState("");

  const handleSend = async () => {
    if (!amount || !to) {
      Alert.alert("Error", "Please enter both recipient and amount");
      return;
    }
    const success = await MockProvider.sendMoney(Number(amount), to);
    Alert.alert(success ? "Success" : "Failed", success ? `Sent ₹${amount} to ${to}` : "Transaction failed");
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Recipient phone or ID"
        value={to}
        onChangeText={setTo}
        style={{ borderWidth: 1, marginBottom: 10, padding: 12, borderRadius: 8, borderColor: '#ccc' }}
      />
      <TextInput
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginBottom: 20, padding: 12, borderRadius: 8, borderColor: '#ccc' }}
      />
      <Button title="Send Money" onPress={handleSend} />
    </View>
  );
}
