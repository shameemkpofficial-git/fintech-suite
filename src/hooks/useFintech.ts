import { getActiveProvider } from "../providers/api";
import { FintechProvider } from "../providers/FintechProvider";

/**
 * Custom hook to access the active Fintech service.
 * Makes it easy to switch providers globally.
 */
export const useFintech = (): FintechProvider => {
  return getActiveProvider();
};
