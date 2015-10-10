import User from './user';

class UserManager {
  createUser(rawUserObject) {
    var newUser = new User(rawUserObject);
    return newUser;
  }

  *saveUser(user) {
    return yield *user.save();
  }
}

export default (new UserManager());
