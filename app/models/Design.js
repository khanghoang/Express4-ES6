import Mongoose from 'mongoose';
const Schema = Mongoose.Schema;

var DesignSchema = new Schema({
  imageURL: String
});

let DesignModel = Mongoose.model('Design', DesignSchema);

export default DesignModel;
