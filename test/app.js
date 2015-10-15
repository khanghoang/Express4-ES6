require('co-mocha');
import App from '../app/App';
import request from 'supertest';
import assert from 'assert';
import sinon from 'sinon';

var testConfig = require('../app/config/test.config.js');

let app, express, mailClient;

before((done) => {
  // mock mailClient
  mailClient = {};
  mailClient.sendMail = sinon.stub();

  app = App.sharedInstance();

  app.config = testConfig;
  app.mailClient = mailClient;

  express = app.express;
  app.run(done);
});


describe('Test endpoints', () => {

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
});
