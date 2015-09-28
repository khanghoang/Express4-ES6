import util from 'util';

let env = process.env.NODE_ENV || 'development';

var config = require(__dirname, util.format('/%s.config.js', env));

export default config;
