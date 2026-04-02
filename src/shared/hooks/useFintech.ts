import { getActiveProvider } from "@/shared/api/api";
import { FintechProvider } from "@/shared/api/FintechProvider";

/**
 * Custom hook to access the active Fintech service.
 * Makes it easy to switch providers globally.
 */
export const useFintech = (): FintechProvider => {
  return getActiveProvider();
};
