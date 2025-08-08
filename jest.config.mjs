export default {
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.mjs$': '$1',
  },
  testMatch: ['**/__tests__/**/*.test.mjs'],
  verbose: true
};
