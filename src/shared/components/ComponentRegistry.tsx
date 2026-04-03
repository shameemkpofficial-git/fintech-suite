import React, { createContext, useContext, useState, ReactNode, lazy, Suspense } from "react";

/**
 * Interface defining the base components of the suite.
 */
interface CoreComponents {
  Button?: React.ComponentType<any>;
  InputField?: React.ComponentType<any>;
  Card?: React.ComponentType<any>;
  LoadingOverlay?: React.ComponentType<any>;
}

/**
 * Registry for UI components to allow global overrides and lazy loading.
 */
class ComponentRegistry {
  private static instance: ComponentRegistry;
  private components: CoreComponents = {};
  
  // Default lazy-loaded components
  private defaults: CoreComponents = {
    Button: lazy(() => import("./Button").then(m => ({ default: m.Button }))),
    InputField: lazy(() => import("./InputField").then(m => ({ default: m.InputField }))),
    LoadingOverlay: lazy(() => import("./LoadingOverlay").then(m => ({ default: m.LoadingOverlay }))),
  };

  private constructor() {}

  public static getInstance(): ComponentRegistry {
    if (!ComponentRegistry.instance) {
      ComponentRegistry.instance = new ComponentRegistry();
    }
    return ComponentRegistry.instance;
  }

  /**
   * Register or override a set of core components.
   */
  public register(overrides: Partial<CoreComponents>): void {
    this.components = { ...this.components, ...overrides };
  }

  /**
   * Resolve a component by its name.
   * Fallback to lazy-loaded defaults if not registered.
   */
  public resolve<K extends keyof CoreComponents>(name: K): CoreComponents[K] {
    return this.components[name] || this.defaults[name];
  }
}

export const componentRegistry = ComponentRegistry.getInstance();

/**
 * React Context for provide components to the tree.
 */
const ComponentContext = createContext<CoreComponents>(componentRegistry["components"]);

export const ComponentProvider: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
  children, 
  fallback = null 
}) => {
  const [components] = useState(() => componentRegistry["components"]);
  
  return (
    <ComponentContext.Provider value={components}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ComponentContext.Provider>
  );
};

/**
 * Hook to use a registered or default component.
 * Note: If using a default component, it will be lazy-loaded and must be inside a Suspense boundary.
 */
export const useComponent = <K extends keyof CoreComponents>(name: K): CoreComponents[K] => {
  const contextComponents = useContext(ComponentContext);
  return contextComponents[name] || componentRegistry.resolve(name);
};

