import Mongoose from 'mongoose';
const Schema = Mongoose.Schema;

var AuthorizationCodeSchema = new Schema({

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client'
  },

  redirectURI: String

});

let AuthorizationCodeModel = Mongoose.model('AuthorizationCode', AuthorizationCodeSchema);

export default AuthorizationCodeModel;
