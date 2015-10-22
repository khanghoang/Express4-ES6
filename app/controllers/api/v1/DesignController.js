import multer from 'multer';
import s3 from 'multer-s3';

/*eslint-disable */
const URL = 'https://s3-ap-southeast-1.amazonaws.com/fox-build-your-f1/uploads/';
/*eslint-enable */

const upload = multer({
  storage: s3({
    dirname: 'uploads',
    bucket: 'fox-build-your-f1',
    secretAccessKey: 'WY9HsXfYXMHfxebntOeQfRiexF03tHPReoQOh5YI',
    accessKeyId: 'AKIAIE6SUIZCTS3DO4PA',
    region: 'ap-southeast-1',
    filename: function(req, file, cb) {
      cb(null, req.designID);
    }
  })
});

class DesignController {
  static uploadDesign = () => {
    let design;
    return [
      function(req, res, next) {
        design = new Designs({});
        req.designID = DesignController.getDesignID(design);
        next();
      },

      upload.single('design'),

      // update design model
      function(req, res, next) {
        design.imageURL = URL + design._id;
        next();
      },

      function(req, res) {
        design.save(function() {
          return res.send(design.imageURL);
        });
      }
    ];
  }

  static getDesigns = async (req, res) => {
    var designs = await Designs.findAsync({});
    return res.status(200).json({data: designs});
  }

  static getDesignID(designModel) {
    return designModel._id;
  }

  static generateNewDesign(params) {
    params = params || {};
    return new Designs(params);
  }
}

export default DesignController;
