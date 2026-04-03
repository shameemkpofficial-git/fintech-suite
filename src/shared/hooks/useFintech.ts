import { useMemo } from "react";
import { useAuthStore } from "@/features/auth/useAuthStore";
import { getActiveProvider } from "@/shared/api/api";
import { FintechProvider } from "@/shared/api/FintechProvider";

/**
 * Custom hook to access the active Fintech service.
 * Features:
 * 1. Provider Switching
 * 2. Auth Error Interception (Auto-logout on 401)
 */
export const useFintech = (): FintechProvider => {
  const logout = useAuthStore((s) => s.logout);
  const provider = getActiveProvider();

  // Proxy the provider to intercept errors (simulating Axios interceptors)
  return useMemo(() => new Proxy(provider, {
    get(target, prop, receiver) {
      const originalMethod = Reflect.get(target, prop, receiver);

      if (typeof originalMethod === 'function') {
        return async (...args: any[]) => {
          try {
            return await originalMethod.apply(target, args);
          } catch (error: any) {
            // Handle Unauthorized/Forbidden errors globally
            if (error?.status === 401 || error?.status === 403 || error?.message?.includes('Unauthorized')) {
              console.warn('[useFintech] Auth session expired. Logging out...');
              logout();
            }
            throw error;
          }
        };
      }
      return originalMethod;
    },
  }), [provider, logout]);
};

