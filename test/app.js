import App from '../app/server';
import request from 'supertest';
import assert from 'assert';

describe('Test endpoints', () => {
  it('get index page', (done) => {
    request(App)
      .get('/')
      .expect(200)
      .end(() => done())
  });

  it('get test endpoint', (done) => {
    request(App)
      .get('/test')
      .expect(200)
      .end(done);
  });

  it('handle error correctly with html request', (done) => {
    request(App)
    .get('/somewierdurl')
    .expect(500)
    .end(done);
  })

  it('handle error correct with json request', (done) => {
    request(App)
    .get('/somewierdurl')
    .accept('application/json')
    .expect(500)
    .end((err, data) => {
      data = JSON.parse(data.text);
      assert.equal(data.message, 'this is expected error');
      done();
    })
  })
});
