var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './app/app.jsx',
    output: {
        path: path.resolve(__dirname, '../server/public'),
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            test: /\.(css|scss)$/,
            use: [{
                loader: "style-loader" // creates style nodes from JS strings
            }, {
                loader: "css-loader" // translates CSS into CommonJS
            }, {
                loader: "sass-loader" // compiles Sass to CSS
            }]
        },{
            test: /\.(js|jsx)$/,
            use: [{
                loader: 'babel-loader'
            }]
        }]
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: 'app/index.html' },
        ])
    ]
}