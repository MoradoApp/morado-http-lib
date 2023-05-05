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
  ],
  testMatch: ['**/*.spec.ts'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 50,
      lines: 70,
      statements: 70,
    },
  },
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  setupFiles: ['dotenv/config'],
};
