const path = require('path');


module.exports = {
    stats:{errorDetails:true},
    target: "web",
    entry: "/index.js",
    output: {
        filename: "../public/main.js"
    },
    node: {
        __dirname: false,
        __filename: false,
      },
    mode: "development",
    //funciona, mas é sus...
    module: {
        rules: [
            {
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: {
                loader: 'babel-loader',
                options: {
                presets: ['@babel/preset-env']
                }
            }
            }
        ],
    },
    
    resolve:{
        fallback: { 
            "buffer": require.resolve("buffer"),
            "stream": require.resolve("stream-browserify") 
        }
    }
};

