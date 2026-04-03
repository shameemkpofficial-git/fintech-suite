import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import { encryptData, decryptData } from "@/shared/utils/crypto";

interface AuthState {
  token: string | null;
  expiresAt: number | null;
  lastPhone: string | null;
  setToken: (token: string, phone?: string, expiresInMs?: number) => void;
  logout: () => void;
  isTokenExpired: () => boolean;
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
    (set, get) => ({
      token: null,
      expiresAt: null,
      lastPhone: null,
      _hasHydrated: false,

      setToken: (token, phone, expiresInMs = 24 * 60 * 60 * 1000) => 
        set({ token, expiresAt: Date.now() + expiresInMs, lastPhone: phone || get().lastPhone }),
      
      logout: () => set({ token: null, expiresAt: null }),
      
      isTokenExpired: () => {
        const { token, expiresAt } = get();
        if (!token || !expiresAt) return true;
        return Date.now() > expiresAt;
      },

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
