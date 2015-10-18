import Mongoose from 'mongoose';
const Schema = Mongoose.Schema;

var AccessTokenSchema = new Schema({

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client'
  }
});

let AccessTokenModel = Mongoose.model('AccessToken', AccessTokenSchema);

export default AccessTokenModel;
