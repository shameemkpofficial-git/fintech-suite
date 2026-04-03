// Jest setup file
global.__DEV__ = true;
import 'react-native-gesture-handler/jestSetup';
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Define BatchedBridgeConfig for NativeModules
global.__fbBatchedBridgeConfig = {
  remoteModuleConfig: [],
};

// Mock React Native internals that fail in Node
jest.mock('react-native/Libraries/BatchedBridge/NativeModules', () => {
  const NativeModules = {
    DeviceInfo: {
      getConstants: () => ({
        Dimensions: {
          window: { width: 375, height: 812, scale: 1, fontScale: 1 },
          screen: { width: 375, height: 812, scale: 1, fontScale: 1 },
        },
      }),
    },
    PlatformConstants: {
      getConstants: () => ({ isTesting: true }),
    },
    RNGestureHandlerModule: {
      State: {},
      Directions: {},
    },
    NativeAnimatedModule: {
      startAnimatingNode: jest.fn(),
      stopAnimation: jest.fn(),
      setNativeProps: jest.fn(),
      dropAnimatedNode: jest.fn(),
      extractAnimatedNodeConfig: jest.fn(),
      connectAnimatedNodes: jest.fn(),
      disconnectAnimatedNodes: jest.fn(),
      createAnimatedNode: jest.fn(),
      getValue: jest.fn(),
    },
    UIManager: {
      createView: jest.fn(),
      setChildren: jest.fn(),
      manageChildren: jest.fn(),
      updateView: jest.fn(),
      removeSubviewsFromContainerWithID: jest.fn(),
      replaceExistingNonRootView: jest.fn(),
      removeRootView: jest.fn(),
      measure: jest.fn(),
      measureInWindow: jest.fn(),
      measureLayout: jest.fn(),
      findSubviewIn: jest.fn(),
      viewIsDescendantOf: jest.fn(),
      dispatchViewManagerCommand: jest.fn(),
      setLayoutAnimationEnabledIndicator: jest.fn(),
      configureNextLayoutAnimation: jest.fn(),
      getContentSizeMultiplier: jest.fn(),
      setJSResponder: jest.fn(),
      clearJSResponder: jest.fn(),
    },
    KeyboardObserver: {
      addListener: jest.fn(),
      removeListeners: jest.fn(),
    },
  };

  return new Proxy(NativeModules, {
    get(target, prop) {
      if (prop === '__fbBatchedBridgeConfig') return global.__fbBatchedBridgeConfig;
      if (!(prop in target)) {
        target[prop] = {
          getConstants: () => ({}),
          addListener: jest.fn(),
          removeListeners: jest.fn(),
        };
      }
      return target[prop];
    },
  });
});

jest.mock('react-native/Libraries/TurboModule/TurboModuleRegistry', () => ({
  get: () => null,
  getEnforcing: (name) => {
    if (name === 'DeviceInfo') {
      return {
        getConstants: () => ({
          Dimensions: {
            window: { width: 375, height: 812, scale: 1, fontScale: 1 },
            screen: { width: 375, height: 812, scale: 1, fontScale: 1 },
          },
        }),
      };
    }
    return {
      getConstants: () => ({}),
    };
  },
}));

jest.mock('react-native/src/private/animated/NativeAnimatedHelper');

// Mock Expo's winter runtime which causes issues in Jest (especially on experimental versions)
jest.mock('expo/src/winter/runtime.native', () => ({}));
jest.mock('expo/src/winter/ImportMetaRegistry', () => ({
  ImportMetaRegistry: {},
}));

// Mock other common native modules
jest.mock('expo-font', () => ({
  isLoaded: jest.fn(() => true),
  loadAsync: jest.fn(),
}));

jest.mock('expo-constants', () => ({
  expoConfig: {
    name: 'FintechSuite',
    slug: 'fintechsuite',
  },
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Ionicons: (props) => React.createElement(View, props),
  };
});

// Suppress react-test-renderer deprecation warnings
// These are expected when using React 19 with @testing-library/react-native
// and will be resolved in future versions of the testing library.
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('react-test-renderer is deprecated')
  ) {
    return;
  }
  originalConsoleError(...args);
};
