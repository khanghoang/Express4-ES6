import Promise from 'bluebird';
import CreateUpdateAt from 'mongoose-timestamp';
import mongoosePaginate from 'mongoose-paginate';

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
    require: true,
    default: 'pending'
  },
  description: String,
  address: String,
  name: String,
  isPinned: {
    type: Boolean,
    default: false
  },
  phone: {
    type: String
  },
  country: {
    type: String
  }
});

DesignSchema.plugin(CreateUpdateAt);
DesignSchema.plugin(mongoosePaginate);

let Design = Promise.promisifyAll(Mongoose.model('Design', DesignSchema));

export default Design;
