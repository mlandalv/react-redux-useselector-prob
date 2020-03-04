const path = require('path');

const config = {
    mode: 'development',
    devtool: 'source-map',
    entry: path.join(__dirname, 'src/TestApp.js'),

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/demo.js',
    },

    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader?cacheDirectory=true',
                include: [
                    path.join(__dirname, 'src'),
                ],
            },
        ],
    },
};

module.exports = config;
