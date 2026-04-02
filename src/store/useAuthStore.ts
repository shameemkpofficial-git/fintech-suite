import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import { encryptData, decryptData } from "../utils/crypto";

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

// Custom storage with Transparent Encryption Layer
const secureStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const encryptedValue = await SecureStore.getItemAsync(name);
    if (!encryptedValue) return null;
    try {
      return decryptData(encryptedValue);
    } catch {
      return encryptedValue; // Fallback for legacy plain data
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    const encryptedValue = encryptData(value);
    await SecureStore.setItemAsync(name, encryptedValue);
  },
  removeItem: async (name: string): Promise<void> => {
    await SecureStore.deleteItemAsync(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      _hasHydrated: false,

      setToken: (token) => set({ token }),
      logout: () => set({ token: null }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => secureStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
