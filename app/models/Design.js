import Mongoose from 'mongoose';
import Promise from 'bluebird';
const Schema = Mongoose.Schema;

var DesignSchema = new Schema({
  imageURL: String
});

let DesignModel = Promise.promisifyAll(Mongoose.model('Design', DesignSchema));

export default DesignModel;
