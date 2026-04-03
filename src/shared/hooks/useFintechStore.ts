import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";
import { Transaction } from "../api/FintechProvider";
import { encryptData, decryptData } from "../utils/crypto";

interface FintechState {
  balance: number | null;
  transactions: Transaction[];
  lastUpdated: number | null;
  setBalance: (balance: number) => void;
  setTransactions: (transactions: Transaction[]) => void;
  clearCache: () => void;
}

/**
 * Persisted store for Fintech data.
 * Used for offline fallback and fast initial rendering.
 * Protected with AES-256 encryption.
 */
export const useFintechStore = create<FintechState>()(
  persist(
    (set) => ({
      balance: null,
      transactions: [],
      lastUpdated: null,

      setBalance: (balance) => set({ balance, lastUpdated: Date.now() }),
      setTransactions: (transactions) => set({ transactions, lastUpdated: Date.now() }),
      clearCache: () => set({ balance: null, transactions: [], lastUpdated: null }),
    }),
    {
      name: "fintech-cache",
      storage: createJSONStorage(() => ({
        getItem: async (name) => {
          const val = await SecureStore.getItemAsync(name);
          return val ? decryptData(val) : null;
        },
        setItem: async (name, value) => {
          await SecureStore.setItemAsync(name, encryptData(value));
        },
        removeItem: (name) => SecureStore.deleteItemAsync(name),
      })),
    }
  )
);
