import App from '../app/server';
import request from 'supertest';

describe('Test endpoints', () => {
  it('get index page', (done) => {
    request(App)
      .get('/')
      .expect(200)
      .end(() => done())
  });
});
