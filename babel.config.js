module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    ie: '11',
                },
                modules: false,
            },
        ],
        '@babel/preset-react',
    ],
    plugins: [
        '@babel/plugin-proposal-class-properties',
    ],
    env: {
        test: {
            plugins: [
                '@babel/plugin-transform-modules-commonjs',
            ],
        },
    },
};
