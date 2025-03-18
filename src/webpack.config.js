module.exports = {
  // other configurations...
  module: {
    rules: [
      // other rules...
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
        exclude: [/node_modules\/html2pdf.js/],
      },
    ],
  },
};
