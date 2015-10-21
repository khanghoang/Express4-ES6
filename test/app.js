require('co-mocha');
import App from '../app/App';
import request from 'supertest';
import assert from 'assert';
import sinon from 'sinon';
import Promise from 'bluebird';
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

  express = app.express;

  // order matter
  yield app.run();

  for (var i = 0, l = 5; i < l; i++) {
    let user = new Users({username: 'khang'});
    let saveAsync = Promise.promisify(user.save);
    yield saveAsync.bind(user);
  }

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
    request(express)
      .get('/')
      .expect(200)
      .end(() => done());
  });

  it('get test endpoint', (done) => {
    request(express)
      .get('/test')
      .expect(200)
      .end(done);
  });

  it('should call send mail function when crash', (done) => {
    request(express)
    .get('/somewierdurl')
    .end(() => {
      assert(mailClient.sendMail.called);
      done();
    });
  });

  it('handle error correctly with html request', (done) => {
    request(express)
    .get('/somewierdurl')
    .expect(500)
    .end(done);
  });

  it('handle error correct with json request', (done) => {
    request(express)
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
    request(express)
      .get('/testSharedInstance')
      .expect(200)
      .end(() => done());
  });

  it('get users', (done) => {
    request(express)
    .get('/api/users')
    .expect(200)
    .end(done);
  });

  it('return 404 for route that not found', (done) => {
    request(express)
    .get('/thisisverylongrouteandnotfound')
    .expect(404)
    .end(done);
  });
});

describe('Test authorization', () => {
  it('Login page', (done) => {
    request(express)
      .get('/login')
      .expect(200)
      .end(done);
  });
  it('the enpoint of token oauth is /oauth/token', (done) => {
    request(express)
      .get('/oauth/token')
      .expect(200)
      .end(done);
  });
});
