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
    let userClass = opt.userClass || Users;

    this.userClass = Promise.promisifyAll(userClass);
    this.instance = {};
  }

  createUser(rawUserObject) {
    let newUser = new Users(rawUserObject);
    return newUser;
  }

  async saveUser(user) {
    return await user.save();
  }

  async findByID(userID) {
    return await this.userClass.findOneAsync({_id: userID});
  }

  async findByUsername(username) {
    return await this.userClass.findOneAsync({username: username});
  }
}

export default UserManager;
