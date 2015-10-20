import App from './App';
import Promise from 'bluebird';
import config from './config/config';

Promise.coroutine(function* () {
  let app = App.sharedInstance();
  app.config = config;
  yield app.run();
})();
