import { FintechProvider, Transaction } from "./FintechProvider";

export const MockProvider: FintechProvider = {
  login: async (phone: string) => {
    console.log("Logging in:", phone);
    return { token: "demo-token" };
  },

  getBalance: async () => {
    return 5240.50;
  },

  sendMoney: async (amount: number, to: string) => {
    console.log(`Sending ${amount} to ${to}`);
    return true;
  },

  getTransactions: async (): Promise<Transaction[]> => {
    return [
      { id: "1", amount: 1500, to: "John Doe", category: "Salary", date: "2024-04-01T10:00:00Z", type: 'incoming' },
      { id: "2", amount: 50.25, to: "Starbucks", category: "Food", date: "2024-04-01T15:30:00Z", type: 'outgoing' },
      { id: "3", amount: 120, to: "Amazon", category: "Shopping", date: "2024-03-31T09:12:00Z", type: 'outgoing' },
      { id: "4", amount: 200, to: "Alice Smith", category: "Transfer", date: "2024-03-30T18:45:00Z", type: 'incoming' },
      { id: "5", amount: 15, to: "Transport", category: "Travel", date: "2024-03-29T08:20:00Z", type: 'outgoing' },
    ];
  }
};
