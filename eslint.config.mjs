import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
});

export default [
    ...compat.extends('universe/native'),
    {
        ignores: [
            'android/**',
            'ios/**',
            '.config/**',
            'node_modules/**',
            'build/**',
            'dist/**',
        ],
    },
    {
        rules: {
            'react-hooks/exhaustive-deps': 'error',
            '@typescript-eslint/no-unused-vars': 'error',
            indent: ['error', 4],
            'no-console': 'error',
            'arrow-body-style': ['error', 'as-needed'],
        },
    },
];
