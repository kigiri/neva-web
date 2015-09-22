var webpack = require('webpack')
  , WebpackDevServer = require('webpack-dev-server')
  , config = require('../webpack.config');

new WebpackDevServer(webpack(config), {
  contentBase: __dirname,
  hot: true,
  noInfo: false,
  historyApiFallback: true,
  stats: {
    colors: true
  },
}).listen(config.port, config.ip, function(err) {
  if (err) { return console.error(err) }
  console.log('Listening at ' + config.ip + ':' + config.port);
});
