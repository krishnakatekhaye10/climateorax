module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  },
  setupFiles: ['<rootDir>/src/tests/setupTests.js'],
  setupFilesAfterEnv: ['@testing-library/jest-dom']
};
