import { CustomBackendProvider } from "./CustomBackendProvider";
import { FintechProvider } from "./FintechProvider";
import { MockProvider } from "./MockProvider";
import { RazorpayProvider } from "./RazorpayProvider";
import { StripeProvider } from "./StripeProvider";
import { providerRegistry } from "./ProviderRegistry";

/**
 * Supported Fintech Provider Types.
 * Easily switch between different services.
 */
export enum ProviderType {
  MOCK = 'MOCK',
  STRIPE = 'STRIPE',
  RAZORPAY = 'RAZORPAY',
  CUSTOM = 'CUSTOM'
}

/**
 * Register default providers.
 */
providerRegistry.register(ProviderType.MOCK, MockProvider);
providerRegistry.register(ProviderType.STRIPE, StripeProvider);
providerRegistry.register(ProviderType.RAZORPAY, RazorpayProvider);
providerRegistry.register(ProviderType.CUSTOM, CustomBackendProvider);

/**
 * Global Configuration for the Active Provider.
 * Read from environment variables (defaults to MOCK).
 */
const ACTIVE_PROVIDER_TYPE: string =
  process.env.EXPO_PUBLIC_ACTIVE_PROVIDER || ProviderType.MOCK;

/**
 * Provider Factory.
 * Returns the implementation based on the active configuration.
 * If a custom provider is registered with a unique key, it can be used here.
 */
export const getActiveProvider = (): FintechProvider => {
  const provider = providerRegistry.get(ACTIVE_PROVIDER_TYPE);
  
  if (!provider) {
    console.warn(`Provider "${ACTIVE_PROVIDER_TYPE}" not found in registry. Falling back to MOCK.`);
    return MockProvider;
  }
  
  return provider;
};

