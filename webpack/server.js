var path = require('path');
var nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './server/server.js',
    output: {
        path: path.resolve(__dirname, '../.build'),
        filename: 'server.js'
    },
    target: 'node', // in order to ignore built-in modules like path, fs, etc.
    externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
    module: {
        rules: [{
            test: /\.(js)$/,
            use: [{
                loader: 'babel-loader'
            }]
        }]
    }
}