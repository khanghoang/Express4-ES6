import App from './App';
import Promise from 'bluebird';
import config from './config/config';
import Mongoose from 'mongoose';

Promise.coroutine(function* () {
  let app = App.sharedInstance();
  app.config = config;
  app.mongoose = Mongoose;
  yield app.run();
})();
