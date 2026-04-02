import { FintechProvider } from "./FintechProvider";

export const MockProvider: FintechProvider = {
  login: async (phone: string) => {
    console.log("Logging in:", phone);
    return { token: "demo-token" };
  },

  getBalance: async () => {
    return 5000;
  },

  sendMoney: async (amount: number, to: string) => {
    console.log(`Sending ${amount} to ${to}`);
    return true;
  },
};
