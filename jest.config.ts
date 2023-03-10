/** @type {import('jest').Config} */
const config = {
  maxConcurrency: 1,
  maxWorkers: 1,
  projects: [
    {
      displayName: 'skchain',
      preset: 'ts-jest/presets/default-esm',
      moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
      },
      transform: {
        '^.+\\.tsx?$': [
          'ts-jest',
          {
            tsconfig: 'tsconfig.json',
            useESM: true,
          },
        ],
      },
      testMatch: [
        '<rootDir>/packages/skchain/tests/**/?(*.)+(spec|test).[jt]s?(x)',
        '<rootDir>/packages/skchain/**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)',
        '<rootDir>/packages/contract/tests/**/?(*.)+(spec|test).[jt]s?(x)',
      ],
      testPathIgnorePatterns: ['/dist/'],
    },
  ],
};

module.exports = config;
