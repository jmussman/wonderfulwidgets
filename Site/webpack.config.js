const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'production',
    // mode: 'development',
    // devtool: 'inline-source-map',   // Comment this line for production.
    entry: {
        main: './src/main/index.ts'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                include: path.resolve(__dirname, 'src'),
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true
                        }
                    }
                ]
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        fallback: { crypto: false }
    },
    output: {
        filename: 'assets/script/sitebundle.js',
        path: path.resolve(__dirname, './dist'),
        library: {
            name: 'application',
            type: 'umd'
        }
    },
    externals: {
        jquery: 'jQuery'
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: './**/*.html', context: "./src/main" },
                { from: './favicon.ico', context: "./src/main" },
                { from: './assets/', to: './assets', context: "./src/main" }
            ]
        })
    ],
    devServer: {
        static: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    }
};