import App from '../app/App';
import request from 'supertest';
import assert from 'assert';

var testConfig = require('../app/config/test.config.js');

let app, express;

before((done) => {
  app = new App({config: testConfig});
  express = app.express;
  app.run(done);
})


describe('Test endpoints', () => {

  it('get index page', (done) => {
    request(express)
      .get('/')
      .expect(200)
      .end(() => done())
  });

  it('get test endpoint', (done) => {
    request(express)
      .get('/test')
      .expect(200)
      .end(done);
  });

  it('handle error correctly with html request', (done) => {
    request(express)
    .get('/somewierdurl')
    .expect(500)
    .end(done);
  })

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
  })
});
