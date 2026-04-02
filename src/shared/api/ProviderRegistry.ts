import { FintechProvider } from "./FintechProvider";

/**
 * Singleton Registry for Fintech Providers.
 * Allows developers to register new providers without modifying core files.
 */
class ProviderRegistry {
  private static instance: ProviderRegistry;
  private providers: Map<string, FintechProvider> = new Map();

  private constructor() {}

  public static getInstance(): ProviderRegistry {
    if (!ProviderRegistry.instance) {
      ProviderRegistry.instance = new ProviderRegistry();
    }
    return ProviderRegistry.instance;
  }

  /**
   * Register a new Fintech Provider.
   * @param id Unique identifier for the provider (e.g., 'STRIPE', 'CUSTOM').
   * @param provider Implementation of the FintechProvider interface.
   */
  public register(id: string, provider: FintechProvider): void {
    this.providers.set(id.toUpperCase(), provider);
  }

  /**
   * Retrieve a registered provider.
   * @param id The unique identifier for the provider.
   */
  public get(id: string): FintechProvider | undefined {
    return this.providers.get(id.toUpperCase());
  }

  /**
   * Get all registered provider IDs.
   */
  public getProviderIds(): string[] {
    return Array.from(this.providers.keys());
  }
}

export const providerRegistry = ProviderRegistry.getInstance();
