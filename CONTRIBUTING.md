# Contributing to Fintech Suite 🤝

First off, thank you for considering contributing to Fintech Suite! It's people like you who make the open-source community an amazing place to learn, inspire, and create.

## 🛠️ Our Vision
Fintech Suite is designed to be a **Production-Grade, Security-First** modular framework. Every addition should prioritize **Resilience**, **Privacy**, and **Performance**.

## 🏗️ Technical Standards

### 1. Feature Modularity
All new features must follow the **Module Registry** pattern. 
-   Isolate features under `src/features/[feature-name]`.
-   Use `index.ts` to export only what is necessary (Actions, UI, Styles).
-   Register the root feature in the `ModuleRegistry` if applicable.

### 2. Style Resilience
We use a memoized `useStyles` hook to handle theme-aware styling.
-   **No inline styles**: Use the hook for all style definitions.
-   **Themed and Scalable**: Use tokens from `shared/constants/Theme.ts`.
-   **Memoization**: Wrap your style definitions to prevent unnecessary re-renders.

### 3. Security-First Code
If your PR introduces new data handling, it **must** leverage our security utils:
-   **Encryption**: Sensitive local data must be encrypted via `src/shared/utils/crypto.ts`.
-   **Privacy**: UI that displays sensitive calculations should use `AppBlurGuard` for background protection.
-   **Native Hygiene**: Avoid manual changes to `android/` or `ios/` folders. Use **Expo Config Plugins** or official Expo libraries.

## 🏁 Getting Started
1. **Fork** the repository.
2. **Clone** it locally: `git clone https://github.com/[your-username]/fintech-suite.git`
3. **Branch**: Create a new branch `feat/your-feature-name`.
4. **Prebuild**: Run `npx expo prebuild` to generate native files.
5. **Lint & Test**: Ensure your code passes all lint checks and existing tests.

## 📝 Commit Guidelines
Use [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation updates
- `refactor:` for code changes that neither fix a bug nor add a feature

---
Ready to build the future of fintech? Open an issue or a PR today! 💎
