import { ReactNode } from "react";

/**
 * Interface representing a FintechSuite Module.
 */
export interface SuiteModule {
  id: string;
  name: string;
  version: string;
  description?: string;
  
  /**
   * Initialization logic for the module.
   * Called when the suite is starting up.
   */
  init?: () => void;
  
  /**
   * A module can provide custom widgets for the dashboard.
   */
  widgets?: Array<{
    id: string;
    title: string;
    component: ReactNode;
  }>;
}

/**
 * Registry for managing FintechSuite Modules.
 */
class ModuleRegistry {
  private static instance: ModuleRegistry;
  private modules: Map<string, SuiteModule> = new Map();

  private constructor() {}

  public static getInstance(): ModuleRegistry {
    if (!ModuleRegistry.instance) {
      ModuleRegistry.instance = new ModuleRegistry();
    }
    return ModuleRegistry.instance;
  }

  /**
   * Register a new module.
   */
  public register(module: SuiteModule): void {
    console.log(`Registering Suite Module: ${module.name} (${module.version})`);
    this.modules.set(module.id.toLowerCase(), module);
    if (module.init) {
      module.init();
    }
  }

  /**
   * Get a module by ID.
   */
  public get(id: string): SuiteModule | undefined {
    return this.modules.get(id.toLowerCase());
  }

  /**
   * List all registered modules.
   */
  public listModules(): SuiteModule[] {
    return Array.from(this.modules.values());
  }
}

export const moduleRegistry = ModuleRegistry.getInstance();
