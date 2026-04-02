import { FintechProvider, Transaction } from "./FintechProvider";

const BASE_URL = "https://api.fintechsuite.example.com"; // Placeholder

export const RealFintechProvider: FintechProvider = {
  login: async (phone: string) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    if (!response.ok) throw new Error("Authentication failed");
    return response.json();
  },

  getBalance: async () => {
    const response = await fetch(`${BASE_URL}/account/balance`);
    if (!response.ok) throw new Error("Failed to fetch balance");
    const data = await response.json();
    return data.balance;
  },

  sendMoney: async (amount: number, to: string) => {
    const response = await fetch(`${BASE_URL}/transactions/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, to }),
    });
    return response.ok;
  },

  getTransactions: async (): Promise<Transaction[]> => {
    const response = await fetch(`${BASE_URL}/transactions`);
    if (!response.ok) throw new Error("Failed to fetch transactions");
    return response.json();
  }
};
