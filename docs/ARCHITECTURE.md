# Architecture Overview - Fintech Suite 🗺️

The Fintech Suite is built on a **Feature-Based Modular Architecture** designed for high maintainability, isolation, and scalability.

## 🏗️ Core Principles

### 1. Modular Autonomy
Every major feature (e.g., `features/wallet`, `features/payments`) is treated as a self-contained unit. Each feature folder contains its own UI components, state management (Zustand), and business logic. This allows teams to work on features in parallel without merge conflicts.

### 2. Registry Pattern (Plug-n-Play)
We use a **Component Registry** (`src/shared/components/ComponentRegistry.ts`) to manage foundational UI elements. 

- **Override Anywhere**: Developers can globally override core components (like the default `Button`) for specific builds without touching the feature's source code.
- **Lazy Registration**: Modules register their components and hooks during initialization, ensuring a small initial bundle footprint.

---

## 📁 System Layers

### API Layer (`src/shared/api`)
- **FintechProvider Interface**: A strict TypeScript contract for all financial operations.
- **Provider Switching**: The `api.ts` utility allows for instant switching between simulation providers and real production gateways (STRP, STELLAR, etc.).
- **Interceptors**: Global error handling and auth expiration detection via a `Proxy` pattern in `useFintech`.

### Data Resilience Layer (`src/shared/hooks`)
- **useSafeRequest**: A high-level hook that orchestrates `useAsync`, `useNetwork`, and `useFintechStore`. It provides:
  - **Local Persistence**: Transparent caching of API responses.
  - **Offline Detection**: Automatic fallback to cached data when signals are lost.
  - **Smart Retries**: Exponential backoff to handle transient network errors.

### State Management (Zustand)
- **Feature Stores**: Each feature has its own localized store (`useAuthStore`, `useWalletStore`).
- **Encrypted Persistence**: All sensitive state is automatically encrypted using AES-256 before being saved to `AsyncStorage` or `SecureStore`.

---

## 🚀 Adding a New Feature

1. **Scaffold**: Create `src/features/[FeatureName]`.
2. **Logic**: Implement feature-specific hooks or stores (`use[FeatureName]Store`).
3. **UI**: Build the view using the `useStyles` design system.
4. **Register**: Add the feature's entry point to the `ModuleRegistry` if dynamic loading is required.
