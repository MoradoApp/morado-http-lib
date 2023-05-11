export default {
  rootDir: './',
  collectCoverageFrom: ['**/*.ts'],
  coverageDirectory: '../coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/test/',
    'jest.config.ts',
    'src/index.ts',
    'morado-http-lib.module.ts',
    'index.ts',
  ],
  testMatch: ['**/*.spec.ts'],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 50,
      lines: 60,
      statements: 60,
    },
  },
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  testEnvironment: 'node',
  testResultsProcessor: 'jest-sonar-reporter',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  setupFiles: ['dotenv/config'],
};
