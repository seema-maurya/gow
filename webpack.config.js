const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "build/static/js"), // Ensure correct output path
    filename: "static/js/bundle.js",
    publicPath: "./",
    clean: true,
  },
  mode: "production",
  devtool: "source-map", // Recommended for production debugging

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Process .js and .jsx files
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
    ],
  },

  resolve: {
    extensions: [".js", ".jsx"], // Ensure Webpack resolves .js and .jsx
  },
};
