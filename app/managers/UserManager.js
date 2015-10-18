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
    // let userClass = opt.userClass || Users;
    let userClass = opt.userClass || {};

    this.userClass = Promise.promisifyAll(userClass);
    this.instance = {};
  }

  User() {
    return this.userClass;
  }


  createUser(rawUserObject) {
    let newUser = new UserClass(rawUserObject);
    return newUser;
  }

  async saveUser(user) {
    return await user.save();
  }

  async findByID(userID) {
    return await this.User.findOneAsync({_id: userID});
  }

  async findByUsername(username) {
    return await this.User.findOneAsync({username: username});
  }
}

export default UserManager;
