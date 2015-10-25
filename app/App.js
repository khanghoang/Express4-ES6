/* @flow */
import express from 'express';
import bar from './bar';
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
import errorHandler from 'errorhandler';
import UserManager from './managers/UserManager';
import requireLogin from './policies/requireLogin';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import mongoStore from 'connect-mongo';
import expressPaginate from 'express-paginate';
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

  loadErrorHandlers = async () => {
    let app = this.express;
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
        return next();
      }

      if (err.toString() !== 'Error: this is expected error') {
        console.log(err.stack);
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

    if (process.env.NODE_ENV === 'development' ||
       process.env.NODE_ENV === 'test') {
      app.use(errorHandler());
    } else {
      app.use((err, req, res, next) => {
        if (err.status === 404) {
          return next(err);
        }

        next(err);
      });
    }

  }


  loadMiddlewares = async () => {

    this.express.use(bodyParser.urlencoded({extended: true}));
    this.express.use(bodyParser.json());
    this.express.use(methodOverride());

    // to use flash messages
    this.express.use(function(req, res, next) {
      res.locals = {
        messages: {}
      };
      next();
    });
    this.express.use(expressPaginate.middleware(10, 50));

    this.express.use('/public', express.static(path.resolve(__dirname, '../public')));

    this.express.use(passport.initialize());
    this.express.use(passport.session({
      maxAge: new Date(Date.now() + 3600000)
    }));

    let mongoStore = MongoStore({session: session});

    this.express.use(cookieParser('notagoodsecretnoreallydontusethisone'));
    this.express.use(session({
      name: ['abc', '.sid'].join(),
      resave: true,
      saveUninitialized: true,
      secret: 'khangkhang',
      genid: function() {
        // use UUIDs for session IDs
        return require('node-uuid').v4();
      },
      store: new mongoStore({
        url: this.config.database.url,
        collection: 'sessions'
      })
    }));


    console.log('start');

    let app = this.express;
    let mongoose = this.mongoose || Mongoose;
    app.set('view engine', 'jade');
    app.set('views', path.resolve(__dirname, '../app/views'));

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


  }

  start = async () => {

    let app = this.express;
    let config = this.config;

    let server = await this.startServer(app, config.server.port);
    this.server = server;
    console.log('Server has started');
  }

  startServer(app, port) {
    return new Promise(function(resolve) {
      var server = app.listen(port, function() {
        resolve(server);
      });
    });
  }

  stop() {
    this.server.close();
  }

  run = async () => {
    connectToDatabase({}, Mongoose);

    // special global variable
    GLOBAL.Promise = require('bluebird');
    GLOBAL._ = require('lodash');

    await this.loadMiddlewares();
    await this.loadModels();
    await this.loadRouters();

    let app = this.express;

    app.get('/', (req, res) => {
      res.send('Hello world' + bar(new Users({}), '2'));
    });

    app.get('/admin', requireLogin, function(req, res) {
      res.send('hello admin');
    });

    let userController = new UserController(Users);

    app.get('/api/users', userController.index);

    app.get('/test', (req, res) => {
      res.send('Hello world');
    });

    app.get('/somewierdurl', (req, res, next) => {
      next(new Error('this is expected error'));
    });

    await this.loadErrorHandlers();
    await this.start();
  }

}

export default App;
