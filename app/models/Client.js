import Mongoose from 'mongoose';
const Schema = Mongoose.Schema;

var ClientSchema = new Schema({
});

let ClientModel = Mongoose.model('Client', ClientSchema);

export default ClientModel;
