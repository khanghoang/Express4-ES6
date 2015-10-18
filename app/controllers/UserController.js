import Promise from 'bluebird';

class UserController {
  constructor(userClass) {
    this.userClass = Promise.promisifyAll(userClass);
  }

  index = async(req, res) => {
    let User = this.userClass || Users;
    var users = [];
    users = await User.findAsync({});
    return res.status(200).json({data: users});
  }
}

export default UserController;
