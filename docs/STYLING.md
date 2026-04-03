# Design System & Styling - Fintech Suite 🎨

The Fintech Suite uses a custom, high-performance styling engine built with **React Native StyleSheets** and a theme-aware **stable hook pattern**.

## 🏗️ The `useStyles` Hook

We avoid inline styles and traditional `StyleSheet.create` for themed components. Instead, we use the custom `useStyles` hook (`src/shared/hooks/useStyles.ts`).

### Stable Factory Pattern
The `useStyles` hook is optimized for performance using the **Latest Factory** pattern:

```tsx
const styles = useStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.four,
    borderRadius: 24,
  },
  text: {
    color: theme.colors.text,
    fontSize: theme.fonts.sans === 'system-ui' ? 18 : 16,
  },
}));
```

- **Reactivity**: Automatically updates all components when the theme (Light/Dark) toggles.
- **Stability**: Memoizes the `StyleSheet` and only recreates it when the theme actually changes, even if the component provides an unstable anonymous function.

---

## 💎 Design Language

### Glassmorphism
We leverage `expo-glass-effect` and `AnimatedCard` to create a premium, modern financial aesthetic. 

- **Aero Blur**: Use `variant="glass"` on `AnimatedCard` to apply a real-time Gaussian blur to the container's background.
- **Micro-interactions**: Buttons and cards use `Animated` from React Native for physics-based spring transitions and 3D scaling on press.

### Theme Tokens (`src/shared/constants/theme.ts`)

| Token | Description |
|---|---|
| **Colors** | Semantic tokens for `text`, `background`, `tint`, `success`, `danger`, and `glass`. |
| **Spacing** | Consistent scale from `half` (2px) up to `six` (64px). |
| **Fonts** | Platform-specific font families (Inter/Roboto) for optimal legibility. |

---

## 🛠️ Usage Guidelines
1. **Prefer `useStyles`**: Always use the hook for any styling that depends on theme colors or spacing.
2. **Atomic Units**: Use `Spacing` tokens for `margin`, `padding`, and `gap` to ensure layout consistency.
3. **Layering**: Use `AnimatedCard` as the standard container for grouped information to maintain the glassmorphic brand identity.
