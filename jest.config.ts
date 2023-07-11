import { JestConfigWithTsJest } from 'ts-jest'
const jestConfig: JestConfigWithTsJest = {
    testEnvironment: "jsdom",
    preset: 'ts-jest/presets/default-esm', // or other ESM presets
    moduleNameMapper: {
        "\\.(css|style)$": "jest-css-modules-transform",
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    transform: {
        // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
        // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
        '^.+\\.ts?$': [
            'ts-jest',
            {
                useESM: true,
            },
        ],
    },
    transformIgnorePatterns: ['node_modules/(?!lit-element|lit-html|lit|@lit/)']
}

export default jestConfig;
