import express from 'express';
import Bar from './bar';
import connectToDatabase from './config/database';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import UserController from './controllers/UserController';
import User from './user';

class App {

  set mailClient(newMailClient) {
    this._mailClient = newMailClient || {};
  }

  set config(newConfig) {
    this._config = newConfig || {};
  }

  get config() {
    return this._config;
  }

  get mailClient() {
    return this._mailClient;
  }

  static sharedInstance() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new App();
    return this.instance;
  }

  constructor() {
    this.express = express();
    this.instance = {};
  }

  run(cb) {
    let app = this.express;
    connectToDatabase(app, mongoose);

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(methodOverride());

    app.get('/', (req, res) => {
      res.send('Hello world' + Bar.foo);
    });

    let userController = new UserController(User);

    app.get('/api/users', userController.index);

    app.get('/test', (req, res) => {
      res.send('Hello world');
    });

    app.get('/somewierdurl', (req, res, next) => {
      next(new Error('this is expected error'));
    });

    // send mail
    app.use((err, req, res, next) => {
      this.mailClient && this.mailClient.sendMail('hoangtrieukhang@gmail');
      next(err);
    });

    // handle error
    app.use((err, req, res, next) => {
      if (!process.env.NODE_ENV === 'production') {
        return next(err);
      }

      if (!err) {
        next();
      }

      let status = err.status || 500;
      let message = err.message || 'Opps, there was an error';

      res.status(status);

      // handle json
      if (req.accepts('application/json')) {
        return res.json({
          status: status,
          message: message
        });
      }

      return res.send(message);
    });

    let config = this.config;

    const server = app.listen(config.server.port, () => {
      const host = server.address().address;
      const port = server.address().port;

      cb && cb();
      console.log('Expess app listening at http://%s:%s', host, port);
    });
  }
}

export default App;
