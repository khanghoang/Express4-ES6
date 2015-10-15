import User from '../models/User';
import Promise from 'bluebird';

class UserManager {

  static sharedInstance(opt) {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new UserManager(opt);
    return this.instance;
  }

  constructor(opt) {
    // default
    opt = opt || {};
    let userClass = opt.userClass || User;

    this.userClass = Promise.promisifyAll(userClass);
    this.instance = {};
  }

  createUser(rawUserObject) {
    var newUser = new User(rawUserObject);
    return newUser;
  }

  async saveUser(user) {
    return await user.save();
  }
}

export default UserManager;
