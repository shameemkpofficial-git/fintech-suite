import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/shared/hooks/use-color-scheme';
import { Colors } from '@/shared/constants/theme';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = Colors[colorScheme === 'dark' ? 'dark' : 'light'].text; // Using text color from theme

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          backgroundColor: Colors[colorScheme === 'dark' ? 'dark' : 'light'].background,
        },
      }}>
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="wallet-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="payments"
        options={{
          title: 'Payments',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="send-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}
