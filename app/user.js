import Mongoose from 'mongoose';
const Schema = Mongoose.Schema;

var UserSchema = new Schema({

  username: String,

  email: String,

  hashed_password: String,

  provider: {
    type: Schema.Types.Array,
    default: []
  }

});

let UserModel = Mongoose.model("User", UserSchema);

export default UserModel;
