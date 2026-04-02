import { MockProvider } from "./MockProvider";
import { RealFintechProvider } from "./RealFintechProvider";
import { FintechProvider } from "./FintechProvider";

// Toggle this as the default or use an environment variable (process.env.EXPO_PUBLIC_USE_MOCK)
const USE_MOCK = true;

/**
 * Access the currently active Fintech Provider implementation.
 * This pattern allows for easy switching between mock and real APIs.
 */
export const getActiveProvider = (): FintechProvider => {
  return USE_MOCK ? MockProvider : RealFintechProvider;
};
