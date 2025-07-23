// tst/e2e/app.e2e.test.tss
import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/test/e2e/**/*.test.[jt]s?(x)"], // Расширенный паттерн
  moduleNameMapper: {
    "^@src/(.*)$": "<rootDir>/src/$1",
    "^@test/(.*)$": "<rootDir>/test/$1",
  },
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "tsconfig.json",
      },
    ],
  },
  setupFilesAfterEnv: ["<rootDir>/test/setup.ts"],
  verbose: true,
};

export default config;
