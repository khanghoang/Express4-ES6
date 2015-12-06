import DesignAPIController from '../controllers/api/v1/DesignController';
import RouterMixin from './_decorators/routerHelper';

const Router = Object.assign({}, RouterMixin, {
  prefix: '/api/v1/design',

  _router: function() {
    return {
      '/upload': {
        post: {
          handler: DesignAPIController.uploadDesign()
        }
      },
      '': {
        get: {
          handler: DesignAPIController.getDesigns
        }
      },
      '/approved': {
        get: {
          handler: DesignAPIController.getAllApprovedDesigns
        }
      },
      '/:id': {
        get: {
          handler: DesignAPIController.getDesignByID
        }
      }
    }
  }
});

export default Router;
