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
 * Set this to switch between Mock, Stripe, Razorpay, or Custom Backend.
 */
const ACTIVE_PROVIDER_TYPE: ProviderType = ProviderType.MOCK;

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
