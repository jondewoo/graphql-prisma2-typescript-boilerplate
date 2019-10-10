// const path = require('path');
// const dotenv = require('dotenv');

// dotenv.config({ path: path.resolve(process.cwd(), `config/${process.env.NODE_ENV}.env`) });

// const { pathsToModuleNameMapper } = require('ts-jest/utils');
// // In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// // which contains the path mapping (ie the `compilerOptions.paths` option):
// const { compilerOptions } = require('./tsconfig');

module.exports = {
    preset: 'ts-jest',
    globalSetup: './tests/jest/globalSetup.ts',
    globalTeardown: './tests/jest/globalTeardown.ts',
    globals: {
        'ts-jest': {
            diagnostics: {
                ignoreCodes: 'TS7016',
            },
        },
    },
    // testEnvironment: './test/config/environment/single-context-environment',
    // setupFilesAfterEnv: ['./jest.setup.js', 'jest-expect-message'],
    // moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' })
};
