import App from '../app/App';
import assert from 'assert';
import session from 'supertest-session';
import sinon from 'sinon';
import path from 'path';

var testConfig = require('../app/config/test.config.js');

let app, express, mailClient;

before(function* () {
  // mock mailClient
  mailClient = {};
  mailClient.sendMail = sinon.stub();

  app = App.sharedInstance();

  app.config = testConfig;
  app.mailClient = mailClient;
  app.mongoose = mongoose;

  mockgoose.reset('Design');

  express = session(app.express);

  // order matter
  yield app.run();

  let user = new Users({
    username: 'khanghoang',
    password: '123456',
    role: 'admin'
  });
  yield user.save();
});


describe('Test endpoints', () => {

  it('mock save user successfully using Mockgoose', function* () {
    var user = new Users({username: 'khang'});
    var result = yield user.save();
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
    .set('Accept', 'application/json')
    .accept('application/json')
    .expect(500)
    .end((err, data) => {
      expect(JSON.parse(data.text).message)
      .to.be.equal('this is expected error');
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

  it('It should redirect to login page if hasnt ' +
     'logged in yet', (done) => {
       express
       .get('/admin')
       .expect(302)
       .end(done);
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
        expect(res.header.location).to.be.equal('/admin/designs/pendingList');
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
    var phone = 12345678;
    express
      .post('/api/v1/design/upload')
      .field('email', 'khanghoang@gmail.com')
      .field('phone', phone)
      .field('country', 'vietnam')
      .attach('design', path.join(__dirname, '/image/test.jpg'))
      .expect(200)
      .end((req, res) => {
        var design = JSON.parse(res.text);
        expect(design.email).to.be.equal('khanghoang@gmail.com');
        expect(design.phone).to.be.equal(phone.toString());
        expect(design.country).to.be.equal('vietnam');
        done();
      });
  });

  it('Should get list of designs that just uploaded', (done) => {
    express
      .get('/api/v1/design')
      .expect(200)
      .end((err, res) => {
        expect(JSON.parse(res.text).data.length).to.be.equal(1);
        Designs.remove({}, done);
      });
  });
});

after(() => {
  // logout by deleting cookies
  express.cookie = null;
  app.stop();
});
