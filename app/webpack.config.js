const path = require('path');
require('dotenv').config()

module.exports = {
    entry: './scripts/app.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.link\.s[ca]ss$/i,
                use: [
                    { loader: "style-loader", options: { injectType: "linkTag" } },
                    { 
                        loader: "file-loader",
                        options: {
                            name(resourcePath, resourceQuery) {                    
                                if (process.env.NODE_ENV === 'DEVELOPMENT') {
                                  return '[path][name].css';
                                }
                    
                                return '[contenthash].css';
                            },
                        },
                    },
                    { loader: "sass-loader" },
                ]
            },
            {
                test: /\.module\.s[ca]ss$/i,
                use: [
                    { 
                        loader: "style-loader", 
                        options: { 
                            injectType: "lazyStyleTag",
                            insert: function insertIntoTarget(element, options) {
                                    var parent = options.target || document.head;

                                    parent.appendChild(element);
                            },
                        }
                    },
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                            modules: true,
                            modules: {
                                localIdentName: process.env.NODE_ENV === 'DEVELOPMENT' ? "[local]" : "[contenthash]" ,
                            }
                        },
                    },
                    { loader: "sass-loader" },
                ]
            }
        ],
    },
};