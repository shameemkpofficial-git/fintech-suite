const expoPreset = require('jest-expo/jest-preset');

module.exports = {
  ...expoPreset,
  watchman: false,
  transform: {
    ...expoPreset.transform,
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@testing-library/react-native|expo-.*|@expo/.*|@react-native/.*)',
  ],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/global-config.json',
  ],
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'html'],
  moduleNameMapper: {
    ...expoPreset.moduleNameMapper,
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)', '**/*.test.[jt]s?(x)'],
};
