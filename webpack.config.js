const path = require('path');


module.exports = {
    stats:{errorDetails:true},
    target: "web",
    entry: "/index.ts",
    output: {
        filename: "../public/main.js"
    },
    node: {
        __dirname: false,
        __filename: false,
      },
    mode: "development",
    module: {
        rules: [
            {
            test: /\.(js|jsx|tsx|ts)$/,
            exclude: /(node_modules)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env',"@babel/preset-typescript"],
                    plugins: ['@babel/plugin-transform-runtime',"@babel/proposal-class-properties","@babel/proposal-object-rest-spread"]     
                }
            }
            }
        ],
    },
    
/**    resolve:{
        fallback: { 
            "buffer": require.resolve("buffer"),
            "stream": require.resolve("stream-browserify") 
        }
    } */
};

