import { MockProvider } from "./MockProvider";
import { StripeProvider } from "./StripeProvider";
import { RazorpayProvider } from "./RazorpayProvider";
import { CustomBackendProvider } from "./CustomBackendProvider";
import { FintechProvider } from "./FintechProvider";

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
 * Global Configuration for the Active Provider.
 * Read from environment variables (defaults to MOCK).
 */
const ACTIVE_PROVIDER_TYPE: ProviderType = 
  (process.env.EXPO_PUBLIC_ACTIVE_PROVIDER as ProviderType) || ProviderType.MOCK;

/**
 * Provider Factory.
 * Returns the implementation based on the active configuration.
 */
export const getActiveProvider = (): FintechProvider => {
  switch (ACTIVE_PROVIDER_TYPE) {
    case ProviderType.STRIPE:
      return StripeProvider;
    case ProviderType.RAZORPAY:
      return RazorpayProvider;
    case ProviderType.CUSTOM:
      return CustomBackendProvider;
    case ProviderType.MOCK:
    default:
      return MockProvider;
  }
};
