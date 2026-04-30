// ESLint 9 flat config — translated from the legacy .eslintrc.json
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import lit from 'eslint-plugin-lit';
import globals from 'globals';

export default [
    {
        // Only lint src TS files (mirrors legacy .eslintignore behavior).
        ignores: [
            'node_modules/**',
            'dist/**',
            'dist-*/**',
            'src/_libs/**',
            '**/*.spec.ts',
            '**/*.css.ts',
            'scripts/**',
            'demo/**',
            'postbuild.js',
            'jest.config.ts',
            'jest.setup.ts',
            'vite.config.demo.js',
            'eslint.config.js'
        ]
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    lit.configs['flat/recommended'],
    {
        files: ['src/**/*.ts'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: './tsconfig.json',
                ecmaVersion: 'latest',
                sourceType: 'module'
            },
            globals: {
                ...globals.browser,
                ...globals.es2021
            }
        },
        rules: {
            // Match legacy @typescript-eslint v6 default: ignore unused catch parameters.
            // (typescript-eslint v8 changed the default to 'all'.)
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'none',
                    varsIgnorePattern: '^_'
                }
            ],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/no-misused-promises': 'error',
            '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
            '@typescript-eslint/naming-convention': [
                'error',
                {
                    selector: 'class',
                    format: ['PascalCase']
                },
                {
                    selector: 'variable',
                    format: ['camelCase', 'UPPER_CASE', 'PascalCase']
                }
            ],
            '@typescript-eslint/ban-ts-comment': [
                'error',
                {
                    'ts-ignore': 'allow-with-description',
                    minimumDescriptionLength: 10
                }
            ],
            'lit/no-invalid-html': 'error',
            'lit/no-template-arrow': 'warn',
            'lit/no-template-map': 'warn',
            'lit/binding-positions': 'warn',
            'no-debugger': 'error',
            'prefer-const': 'error',
            'prefer-template': 'error',
            'no-console': [
                'error',
                {
                    allow: ['warn', 'error']
                }
            ],
            'no-multiple-empty-lines': [
                'error',
                {
                    max: 1
                }
            ],
            eqeqeq: ['error', 'always'],
            curly: ['error', 'all'],
            complexity: ['error', 10],
            'max-lines': ['error', 300],
            'max-lines-per-function': [
                'error',
                {
                    max: 50,
                    skipBlankLines: true,
                    skipComments: true
                }
            ],
            'max-depth': ['error', 4],
            'padding-line-between-statements': [
                'error',
                {
                    blankLine: 'always',
                    prev: 'block',
                    next: '*'
                },
                {
                    blankLine: 'always',
                    prev: 'block-like',
                    next: '*'
                }
            ],
            'no-restricted-imports': [
                'error',
                {
                    paths: [
                        {
                            name: 'lit-element',
                            message: "Do not use 'lit-element'. Use 'lit' and 'lit/decorators.js' instead."
                        },
                        {
                            name: 'lit-html',
                            message: "Do not use 'lit-html'. Use 'lit' instead."
                        }
                    ]
                }
            ]
        }
    }
];
