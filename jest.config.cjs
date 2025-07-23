// jest.config.cjs
const { defaults: tsjPreset } = require("ts-jest/presets");

module.exports = {
  ...tsjPreset,
  preset: "ts-jest",
  testEnvironment: "node",
  // Ищем все тесты в папке test/
  testMatch: [
    "**/test/unit/**/*.test.ts",
    "**/test/integration/**/*.test.ts",
    "**/test/e2e/**/*.test.ts",
  ],
  moduleNameMapper: {
    "^@src/(.*)$": "<rootDir>/src/$1",
    "^@test/(.*)$": "<rootDir>/test/$1",
  },
  transform: {
    ...tsjPreset.transform,
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: "./tsconfig.json",
        isolatedModules: true,
      },
    ],
  },
  setupFilesAfterEnv: ["<rootDir>/test/setup.ts"],
  testTimeout: 30000,
  resolver: "<rootDir>/jest-resolver.cjs",
};
