import User from '../models/User';

class UserManager {
  createUser(rawUserObject) {
    var newUser = new User(rawUserObject);
    return newUser;
  }

  * saveUser(user) {
    return yield* user.save();
  }
}

export default (new UserManager());
