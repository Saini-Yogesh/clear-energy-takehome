module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^react-native$': '<rootDir>/node_modules/react-native',
  },
  globals: {
    __DEV__: true,
  },
};
