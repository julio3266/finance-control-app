module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            [
                'module-resolver',
                {
                    root: '.',
                    extensions: [
                        '.js',
                        '.jsx',
                        '.ts',
                        '.tsx',
                        '.android.js',
                        '.android.tsx',
                        '.ios.js',
                        '.ios.tsx',
                    ],
                    alias: {
                        assets: './app/assets',
                        '@app': './app',
                        '@modules': './app/modules',
                        '@auth': './app/modules/auth',
                        '@accounts': './app/modules/accounts',
                        '@credit-card': './app/modules/credit-card',
                        '@budget': './app/modules/budget',
                        '@more': './app/modules/more',
                        '@profile': './app/modules/profile',
                        '@open-finance': './app/modules/open-finance',
                        '@extract': './app/modules/extract',
                        '@expenses': './app/modules/expenses',
                        '@incomes': './app/modules/incomes',
                        '@store': './app/store',
                        '@ui': './app/ui',
                        '@utils': './app/utils',
                    },
                },
            ],
        ],
    };
};
