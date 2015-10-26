import {Router as router} from 'express';
import DesignAPIController from '../controllers/api/v1/DesignController';
import DesignController from '../controllers/DesignController';

class DesignControllerRouter {
  static route() {
    this.router = router();

    // this is the API
    this.router.post('/api/v1/design/upload',
                     DesignAPIController.uploadDesign());
    this.router.get('/api/v1/design',
                    DesignAPIController.getDesigns);
    this.router.get('/api/v1/design/approved',
                    DesignAPIController.getAllApprovedDesigns);

    // this is for CMS
    this.router.get('/admin/designs', DesignController.index);
    this.router.get('/admin/designs/approvedList',
                    DesignController.approvedPage);
    this.router.get('/admin/designs/rejectedList',
                    DesignController.rejectedPage);
    this.router.get('/admin/designs/pendingList',
                    DesignController.pendingPage);
    this.router.get('/admin/designs/approve/:id', DesignController.approve);
    this.router.get('/admin/designs/reject/:id', DesignController.reject);

    return this.router;
  }
}

export default DesignControllerRouter;
