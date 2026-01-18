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
        ignores: ['android/**', 'ios/**', '.config/**', 'node_modules/**', 'build/**', 'dist/**'],
    },
    {
        rules: {
            'react-hooks/exhaustive-deps': 'error',
            '@typescript-eslint/no-unused-vars': 'off',
            indent: 'off',
            'no-console': 'error',
            'arrow-body-style': ['error', 'as-needed'],
            'node/handle-callback-err': 'off',
            'node/no-callback-literal': 'off',
            'node/no-exports-assign': 'off',
            'node/no-extraneous-import': 'off',
            'node/no-extraneous-require': 'off',
            'node/no-missing-import': 'off',
            'node/no-missing-require': 'off',
            'node/no-unpublished-bin': 'off',
            'node/no-unpublished-import': 'off',
            'node/no-unpublished-require': 'off',
            'node/no-unsupported-features/es-builtins': 'off',
            'node/no-unsupported-features/es-syntax': 'off',
            'node/no-unsupported-features/node-builtins': 'off',
            'node/prefer-global/buffer': 'off',
            'node/prefer-global/console': 'off',
            'node/prefer-global/process': 'off',
            'node/prefer-global/url-search-params': 'off',
            'node/prefer-global/url': 'off',
            'node/prefer-promises/dns': 'off',
            'node/prefer-promises/fs': 'off',
            'node/process-exit-as-throw': 'off',
            'node/shebang': 'off',
            'import/order': 'off',
            'import/group-exports': 'off',
            'import/newline-after-import': 'off',
            'import/no-duplicates': 'off',
            'import/no-unresolved': 'off',
            'import/named': 'off',
            'import/default': 'off',
            'import/namespace': 'off',
            'import/no-absolute-path': 'off',
            'import/no-dynamic-require': 'off',
            'import/no-internal-modules': 'off',
            'import/no-webpack-loader-syntax': 'off',
            'import/export': 'off',
            'import/no-named-as-default': 'off',
            'import/no-named-as-default-member': 'off',
            'import/no-deprecated': 'off',
            'import/no-extraneous-dependencies': 'off',
            'import/no-mutable-exports': 'off',
            'import/no-unused-modules': 'off',
        },
    },
];
