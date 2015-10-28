/* @flow */
import express from 'express';
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
import session from 'express-session';
import cookieParser from 'cookie-parser';
import mongoStore from 'connect-mongo';
import expressPaginate from 'express-paginate';
import {Strategy as LocalStrategy} from 'passport-local';
import ConnectRoles from 'connect-roles';
import Policy from './policies/Policy';

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
    this.roles = new ConnectRoles({
      // optional function to customise code that runs when
      // user fails authorisation
      failureHandler: function(req, res, action) {
        var accept = req.headers.accept || '';
        if (accept.indexOf('html') > 0) {
          res.redirect('/login');
        } else {
          res.status(403);
          res.json({message: 'Access Denied - You don\'t' +
                   ' have permission to: ' + action});
        }
      }
    });
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

    var allowCrossDomain = function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Credentials', true);
      res.header('Access-Control-Allow-Headers',
                 'Content-Type, Authorization, ' +
                  'Content-Length, X-Requested-With');
      next();
    };
    this.express.use(allowCrossDomain);

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

    // all currentPage to use in view
    this.express.use(function(req, res, next) {
      res.locals.currentPage = req.query.page;
      next();
    });

    // generate all the prev and next urls
    this.express.use(function(req, res, next) {
      res.locals.paginate.getArrayPages = function(limit) {
        limit = limit || 3;
        return function(pageCount, currentPage) {
          let maxPage = pageCount;
          if (limit > 0) {
            let start = currentPage - limit > 0 ? currentPage - limit : 1;
            let end = currentPage + limit > maxPage ?
              maxPage : currentPage + limit;
            let pages = [];
            for (let i = start; i <= end; i++) {
              pages.push({
                number: i,
                url: res.locals.paginate.href()
                .replace('page=' + (currentPage + 1), 'page=' + i)
              });
            }

            return pages;
          }
        };
      };
      next();
    });

    this.express.use('/public',
                     express.static(path.resolve(__dirname, '../public')));

    this.express.use(passport.initialize());
    this.express.use(passport.session({
      maxAge: new Date(Date.now() + 3600000)
    }));

    let Store = mongoStore({session: session});

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
      store: new Store({
        url: this.config.database.url,
        collection: 'sessions'
      })
    }));


    console.log('start');

    let app = this.express;
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
      done(null, user);
    });

    passport.deserializeUser(function(id, done) {
      UserManager.find(id, function(err, user) {
        done(err, user);
      });
    });

    this.express.use(function(req, res, next) {
      if (_.get(req, 'session.passport.user', null)) {
        res.locals.user = req.session.passport.user;
      }
      next();
    });

    // roles, authorization
    // need to be after passport
    Policy.initPolicies(this.express, this.roles);
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
    GLOBAL.ObjectID = require('mongodb').ObjectID;
    GLOBAL.roles = this.roles;

    await this.loadMiddlewares();
    await this.loadModels();

    this.express.use('/admin/*', roles.can('admin'));

    await this.loadRouters();

    let app = this.express;

    app.get('/', (req, res) => {
      res.redirect('/admin/');
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
