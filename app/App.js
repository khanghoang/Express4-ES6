import express from 'express';
import Bar from './bar';
import connectToDatabase from './config/database';
import Mongoose from 'mongoose';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import UserController from './controllers/UserController';
import path from 'path';
import fs from 'fs';
import pluralize from 'pluralize';
import Promise from 'bluebird';
import passport from 'passport';
import UserManager from './managers/UserManager';
import {Strategy as LocalStrategy} from 'passport-local';

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

  async loadRouters() {
    let readdirAsync = Promise.promisify(fs.readdir);
    let files = await readdirAsync(path.resolve(__dirname, './routers'));
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      let stringFile = './routers/' + file;
      if (stringFile.indexOf('.js.map') === -1) {
        let router = stringFile.replace('.js', '');
        router = require(router);
        this.express.use('/', router.route());
      }
    }

    console.log('finish loading routers');
  }

  async loadModels() {
    let readdirAsync = Promise.promisify(fs.readdir);
    let files = await readdirAsync(path.resolve(__dirname, './models'));
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      let stringFile = './models/' + file;
      if (file.indexOf('.js.map') === -1) {
        let modelName = pluralize(file.replace('.js', ''));
        global[modelName] = require(stringFile);
      }
    }

    console.log('finish loading modules');
  }

  start = async () => {

    console.log('start');

    let app = this.express;
    let mongoose = this.mongoose || Mongoose;
    connectToDatabase(app, mongoose);

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(methodOverride());

    app.set('view engine', 'jade');
    app.set('views', path.resolve(__dirname, '../app/views'));

    app.get('/', (req, res) => {
      res.send('Hello world' + Bar.foo);
    });

    passport.use(new LocalStrategy(
      Promise.coroutine(function* (username, password, done) {
        var user = yield UserManager.sharedInstance().findByUsername(username);
        if (!user) {
          return done(null, false);
        }
        var validPassword = user.authenticate(password);
        if (!validPassword) {
          return done(null, false);
        }
        return done(null, user);
      })
    ));

    passport.serializeUser(function(user, done) {
      done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
      UserManager.find(id, function(err, user) {
        done(err, user);
      });
    });

    let userController = new UserController(Users);

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

    if (process.env.NODE_ENV === 'development' ||
       process.env.NODE_ENV === 'test') {
      // app.use(errorHandler());
      // next(err);
    } else {
      app.use((err, req, res, next) => {
        if (err.status === 404) {
          return next(err);
        }

        console.error(err.stack);
        next(err);
      });
    }

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

    var listenAsync = Promise.promisify(app.listen);

    await listenAsync.bind(app)(config.server.port);
    console.log('Server has started');
  }

  run = async () => {
    this.express.use(bodyParser.urlencoded());

    this.express.use(passport.initialize());
    this.express.use(passport.session({
      maxAge: new Date(Date.now() + 3600000)
    }));

    await this.loadModels();
    await this.loadRouters();
    await this.start();
  }

}

export default App;
