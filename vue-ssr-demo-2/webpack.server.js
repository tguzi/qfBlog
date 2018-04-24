const path = require('path');
const projectRoot = path.resolve(__dirname, '..');
const path = require('path');
const projectRoot = path.resolve(__dirname, '..');

module.export = {
  target: 'node',
  entry: path.join(projectRoot, 'src/enter-server.js'),
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(projectRoot, 'dist'),
    filename: 'bundle.server.js',
  },
  modules: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: projectRoot,
        exclude: /node_modules/,
      },
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.runtime.esm.js'
    }
  }
}
