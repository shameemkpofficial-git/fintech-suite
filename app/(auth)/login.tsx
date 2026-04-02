import { router } from "expo-router";
import { useState } from "react";
import { Button, TextInput, View } from "react-native";
import { MockProvider } from "../../src/providers/MockProvider";
import { useAuthStore } from "../../src/store/useAuthStore";

export default function Login() {
    const [phone, setPhone] = useState("");
    const setToken = useAuthStore((s) => s.setToken);

    const handleLogin = async () => {
        const res = await MockProvider.login(phone);
        setToken(res.token);
        router.replace("/wallet");
    };

    return (
        <View style={{ padding: 20 }}>
            <TextInput
                placeholder="Enter phone"
                value={phone}
                onChangeText={setPhone}
                style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
            />
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
}
