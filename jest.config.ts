import { JestConfigWithTsJest } from 'ts-jest'
const jestConfig: JestConfigWithTsJest = {
    testEnvironment: "jsdom",
    preset: 'ts-jest/presets/default-esm',
    moduleNameMapper: {
        "\\.(css|style)$": "jest-css-modules-transform",
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    transform: {
        '^.+\\.ts?$': [
            'ts-jest',
            {
                useESM: true,
            },
        ],
    },
}

export default jestConfig;
