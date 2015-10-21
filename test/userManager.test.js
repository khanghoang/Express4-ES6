require('co-mocha');

import UserManager from '../app/managers/UserManager';
import assert from 'assert';
import sinon from 'sinon';
import User from '../app/models/User';

const userManager = UserManager.sharedInstance({userClass: User});

describe('User Manager', function() {
  it('should create user successfully', function() {
    var user = userManager.createUser({username: 'khang'});
    assert.equal(user.username, 'khang');
  });

  it('should call save when saving user', function* () {
    var user = userManager.createUser({username: 'khang'});
    var saveStub = sinon.stub(user, 'save');
    yield userManager.saveUser(user);
    assert(saveStub.called);
  });

  it('return user model with _id field', function* () {

    var user = userManager.createUser({username: 'khang'});

    // creat stub and defind the return value
    sinon.stub(user, 'save', function() {
      return {_id: '123', username: 'khang'};
    });

    var savedUser = yield userManager.saveUser(user);
    assert(savedUser._id, '123');
  });
});
