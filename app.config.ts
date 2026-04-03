import { ExpoConfig, ConfigContext } from 'expo/config';
import APP_CONFIG from './global-config.json';



export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: APP_CONFIG.name,
  slug: APP_CONFIG.slug,
  version: APP_CONFIG.version,
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: APP_CONFIG.scheme,
  userInterfaceStyle: "automatic",
  
  ios: {
    icon: "./assets/expo.icon",
    supportsTablet: true,
  },
  
  android: {
    adaptiveIcon: {
      backgroundColor: APP_CONFIG.theme.backgroundLight,
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png"
    },
    predictiveBackGestureEnabled: false
  },
  
  web: {
    output: "static",
    favicon: "./assets/images/favicon.png"
  },
  
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        "backgroundColor": APP_CONFIG.theme.primaryLight,
        "android": {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 76
        }
      }
    ],
    "expo-secure-store"
  ],
  
  updates: {
    url: "https://u.expo.dev/" + APP_CONFIG.eas.projectId,
    checkAutomatically: "ON_LOAD",
    fallbackToCacheTimeout: 0
  },
  
  runtimeVersion: {
    policy: "appVersion"
  },
  
  experiments: {
    typedRoutes: true,
    reactCompiler: true
  },
  
  extra: {
    eas: {
      projectId: APP_CONFIG.eas.projectId
    }
  }
});
