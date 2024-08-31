module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: ['**/__tests__/**/*.test.(ts|js)'],
  setupFiles: ['dotenv/config'],
  moduleNameMapper: {
    '^@prisma/client$': '<rootDir>/__mocks__/prisma.ts',
    '^axios$': '<rootDir>/__mocks__/axios.ts',
  }
};

