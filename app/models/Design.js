import Promise from 'bluebird';

const Schema = Mongoose.Schema;

const DesignStatus = {
  values: 'approved rejected pending'.split(' '),
  message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
};

var DesignSchema = new Schema({
  imageURL: String,
  caption: String,
  email: String,
  status: {
    type: String,
    enum: DesignStatus,
    require: true
  }
});

let Design = Promise.promisifyAll(Mongoose.model('Design', DesignSchema));

export default Design;
