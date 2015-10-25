import {Router as router} from 'express';
import DesignAPIController from '../controllers/api/v1/DesignController';
import DesignController from '../controllers/DesignController';

class DesignControllerRouter {
  static route() {
    this.router = router();

    // this is the API
    this.router.post('/v1/api/design/upload',
                     DesignAPIController.uploadDesign());
    this.router.get('/v1/api/design',
                    DesignAPIController.getDesigns);
    this.router.get('/v1/api/design/approved',
                    DesignAPIController.getAllApprovedDesigns);

    // this is for CMS
    this.router.get('/admin/designs', DesignController.index);

    return this.router;
  }
}

export default DesignControllerRouter;
