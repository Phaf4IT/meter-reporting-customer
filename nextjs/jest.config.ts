/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type {Config} from 'jest';
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

const config: Config = {
  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,
  projects:[
    "<rootDir>/jest.page.config.ts",
    "<rootDir>/jest.integration.config.ts",
  ],
};

export default createJestConfig(config);
