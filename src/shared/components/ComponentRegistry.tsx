import React, { createContext, useContext, useState, ReactNode } from "react";

/**
 * Interface defining the base components of the suite.
 */
interface CoreComponents {
  Button?: React.ComponentType<any>;
  InputField?: React.ComponentType<any>;
  Card?: React.ComponentType<any>;
}

/**
 * Registry for UI components to allow global overrides.
 */
class ComponentRegistry {
  private static instance: ComponentRegistry;
  private components: CoreComponents = {};

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
   * If not registered, it should fallback to a default implementation.
   */
  public resolve<K extends keyof CoreComponents>(name: K): CoreComponents[K] {
    return this.components[name];
  }
}

export const componentRegistry = ComponentRegistry.getInstance();

/**
 * React Context for provide components to the tree.
 * This can be used for deep component injection.
 */
const ComponentContext = createContext<CoreComponents>(componentRegistry["components"]);

export const ComponentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [components] = useState(() => componentRegistry["components"]);
  return <ComponentContext.Provider value={components}>{children}</ComponentContext.Provider>;
};

export const useComponent = <K extends keyof CoreComponents>(name: K): CoreComponents[K] => {
  const contextComponents = useContext(ComponentContext);
  return contextComponents[name] || componentRegistry.resolve(name);
};
