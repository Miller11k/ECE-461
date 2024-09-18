module.exports = {
    preset: 'ts-jest', // Use ts-jest preset for TypeScript support in Jest
    testEnvironment: 'node', // Set the test environment to Node.js
    collectCoverage: true, // Enable coverage reporting to track which code is tested
    coverageDirectory: 'coverage', // Specify the directory where coverage reports will be saved
    coverageReporters: ['json', 'lcov', 'text', 'clover'], // Define the format(s) for coverage reports
    moduleFileExtensions: ['ts', 'js'], // Allow Jest to handle TypeScript (.ts) and JavaScript (.js) files
    testMatch: ['**/__tests__/**/*.test.ts'], // Match test files in __tests__ folders with the .test.ts extension
  };
  