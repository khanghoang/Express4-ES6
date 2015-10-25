import Mongoose from 'mongoose';
import crypto from 'crypto';
const Schema = Mongoose.Schema;

var UserSchema = new Schema({

  username: String,

  email: String,

  salt: String,

  hashedPassword: String,

  provider: {
    type: Schema.Types.Array,
    default: []
  },

  role: String

});

UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

UserSchema.methods = {

  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */

  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */

  makeSalt: function() {
    return Math.round(new Date().valueOf() * Math.random()) + '';
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */

  encryptPassword: function(password) {
    if (!password) {
      return '';
    }
    var encrypred;
    try {
      encrypred = crypto.createHmac('sha1', this.salt)
      .update(password)
      .digest('hex');

      return encrypred;
    } catch (err) {
      return '';
    }
  }
};

let UserModel = Mongoose.model('User', UserSchema);

export default UserModel;
