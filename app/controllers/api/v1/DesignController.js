import multer from 'multer';
import s3 from 'multer-s3';

const upload = multer({
  storage: s3({
    dirname: 'uploads',
    bucket: 'fox-build-your-f1',
    secretAccessKey: 'WY9HsXfYXMHfxebntOeQfRiexF03tHPReoQOh5YI',
    accessKeyId: 'AKIAIE6SUIZCTS3DO4PA',
    region: 'ap-southeast-1',
    filename: function(req, file, cb) {
      // try to get design id and assign to this as
      // file name
      // cb(null, Date.now());
      cb(null, req.designID);
      console.log(req.designID);
    }
  })
});

class DesignController {
  static uploadDesign = () => {
    return [
      function(req) {
        req.designID = this.getDesignID();
        console.log('here req', req);
        console.log(this.getDesignID());
        next();
      },
      upload.single('design'),
      function(req, res) {
        return res.send('design');
      }
    ];
  }

  getDesignID(designModel) {
    return designModel._id;
  }

  generateNewDesign(params) {
    return new Designs(params);
  }
}

export default DesignController;
