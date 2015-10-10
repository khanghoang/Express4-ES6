require('co-mocha');

var rewire = require('rewire');
var UserManager = require('../app/UserManager');
import User from '../app/user';
import assert from 'assert';
import sinon from 'sinon';

describe('User Manager', function() {
  it('should create user successfully', function() {
    var user = UserManager.createUser({username: 'khang'});
    assert.equal(user.username, 'khang');
  })

  it('should call save when saving user', function * () {
    var user = UserManager.createUser({username: 'khang'});
    var saveStub = sinon.stub(user, 'save');
    yield UserManager.saveUser(user);
    assert(saveStub.called);
  });

  it('return user model with _id field', function * () {

    var user = UserManager.createUser({username: 'khang'});

    // creat stub and defind the return value
    var saveStub = sinon.stub(user, 'save', function *() {
      return yield({_id: '123', username: 'khang'})
    });

    var savedUser = yield UserManager.saveUser(user);
    assert(savedUser._id, '123');
  });
})
