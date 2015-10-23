require('co-mocha');
import App from '../app/App';
import assert from 'assert';
import {expect} from 'chai';
import session from 'supertest-session';
import sinon from 'sinon';
import Promise from 'bluebird';
import path from 'path';
var mongoose = require('mongoose');
var mockgoose = require('mockgoose');

var testConfig = require('../app/config/test.config.js');

let app, express, mailClient;

mockgoose(mongoose);

before(function* () {
  // mock mailClient
  mailClient = {};
  mailClient.sendMail = sinon.stub();

  app = App.sharedInstance();

  app.config = testConfig;
  app.mailClient = mailClient;
  app.mongoose = mongoose;

  express = session(app.express);

  // order matter
  yield app.run();

  let user = new Users({username: 'khanghoang', password: '123456'});
  let saveAsync = Promise.promisify(user.save);
  yield saveAsync.bind(user);
});


describe('Test endpoints', () => {

  it('mock save user successfully using Mockgoose', function* () {
    var user = new Users({username: 'khang'});
    let saveAsync = Promise.promisify(user.save);
    var result = yield saveAsync.bind(user);
    assert(result, 1);
  });

  it('get users from db', function* () {
    let users = yield Users.findAsync({});
    assert(users.length, 6);
  });

  it('get index page', (done) => {
    express
      .get('/')
      .expect(200)
      .end(() => done());
  });

  it('get test endpoint', (done) => {
    express
      .get('/test')
      .expect(200)
      .end(done);
  });

  it('should call send mail function when crash', (done) => {
    express
    .get('/somewierdurl')
    .end(() => {
      assert(mailClient.sendMail.called);
      done();
    });
  });

  it('handle error correctly with html request', (done) => {
    express
    .get('/somewierdurl')
    .expect(500)
    .end(done);
  });

  it('handle error correct with json request', (done) => {
    express
    .get('/somewierdurl')
    .accept('application/json')
    .expect(500)
    .end((err, data) => {
      data = JSON.parse(data.text);
      assert.equal(data.message, 'this is expected error');
      done();
    });
  });

  it('get test app shared instance', (done) => {
    express
      .get('/testSharedInstance')
      .expect(200)
      .end(() => done());
  });

  it('get users', (done) => {
    express
    .get('/api/users')
    .expect(200)
    .end(done);
  });

  it('return 404 for route that not found', (done) => {
    express
    .get('/thisisverylongrouteandnotfound')
    .expect(404)
    .end(done);
  });
});

describe('Test authorization', () => {
  it('Login page', (done) => {
    express
      .get('/login')
      .expect(200)
      .end(done);
  });

  it('It should redirect after to login page if hasnt ' +
     'logged in yet', (done) => {
       express
       .get('/admin')
       .expect(200)
       .end((err, res) => {
         // redirect to login page
         expect(res.header.location).to.include('/login');
         done();
       });
     });

  it('Login successfully by local username and password', (done) => {
    express
      .post('/login')
      .type('form')
      .send({username: 'khanghoang',
            password: '123456'})
      .expect(302)
      .end(done);
  });

  it('It should redirect after logging in', (done) => {
    express
      .get('/admin')
      .end((err, res) => {
        expect(res.text).to.be.ok;
        // doesn't redirect to login page
        expect(res.header.location).to.be.undefined;
        done();
      });
  });

  it('It shouldnt go to login after login', (done) => {
    express
      .get('/login')
      .end((err, res) => {
        expect(res.header.location).to.equal('/admin');
        done();
      });
  });
});

describe('Design API', function() {

  // sometimes it needs more time to upload to s3
  // and return that for you
  // this one set mocha's timeout
  this.timeout(5000);

  it('Should upload design successfully', (done) => {
    express
      .post('/v1/design/upload')
      .attach('design', path.join(__dirname, '/image/test.jpg'))
      // .field({name: 'khanghoang'})
      .expect(200)
      .end(done);
  });

  it('Should get list of designs that just uploaded', (done) => {
    express
      .get('/v1/design')
      .expect(200)
      .end((err, res) => {
        expect(JSON.parse(res.text).data.length).to.equal(1);
        done();
      });
  });
});

after(() => {
  // logout by deleting cookies
  express.cookie = null;
  app.stop();
});
