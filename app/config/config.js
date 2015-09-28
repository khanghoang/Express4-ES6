import util from 'util';
import path from 'path';

let env = process.env.NODE_ENV || 'development';

var config = require(path.join(__dirname, util.format('/%s.config.js', env)));

export default config;
