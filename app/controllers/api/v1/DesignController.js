import multer from 'multer';
import s3 from 'multer-s3';
import Promise from 'bluebird';
import DesignManager from '../../../managers/DesignManager';

let config = require('../../../config/config');

/*eslint-disable */
const URL = 'https://s3-ap-southeast-1.amazonaws.com/fox-build-your-f1/uploads/';
/*eslint-enable */

let filename;

const upload = multer({
  storage: s3({
    dirname: 'uploads',
    bucket: 'fox-build-your-f1',
    secretAccessKey: config.s3.secretAccessKey,
    accessKeyId: config.s3.accessKeyId,
    region: 'ap-southeast-1',
    filename: function(req, file, cb) {
      filename = Date.now();
      cb(null, filename);
    }
  })
});

class DesignController {
  static uploadDesign = () => {
    let design;
    return [

      // always call multer first, so we can get
      // the req.body
      upload.single('design'),

      Promise.coroutine(function* (req, res, next) {
        design = new Designs(req.body);

        // validate the design model
        let error = design.validateSync();
        if (error) {
          return next(new Error(error));
        }

        // assign designID to use as filename to upload to s3
        req.designID = DesignController.getDesignID(design);

        next();
      }),

      // update design model
      function(req, res, next) {
        design.imageURL = URL + filename;
        next();
      },

      Promise.coroutine(function* (req, res, next) {
        try {
          yield design.save();
        } catch (e) {
          return next(e);
        }

        return res.status(200).json(design);
      })
    ];
  }

  static getAllApprovedDesigns = async (req, res, next) => {
    let approvedDesigns = {};
    let query = req.query || req.body;
    try {
      approvedDesigns = await DesignManager
      .getAllApprovedDesigns(query, {status: 'approved'});
    } catch (e) {
      next(e);
    }

    return res.status(200).json(approvedDesigns);
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
