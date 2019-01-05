var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  RootUrl: 'http://test.wfw.zwjk.com',
  LocalUrl: 'http://res.zwjk.com/h5-test/open-web/dev/#'
});
