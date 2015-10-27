import {Router as router} from 'express';
import DesignAPIController from '../controllers/api/v1/DesignController';
import DesignController from '../controllers/DesignController';

class DesignControllerRouter {
  static route() {
    this.router = router();

    let getApiPath = function(path) {
      return '/api/v1/design' + path;
    };

    let getAdminPath = function(path) {
      return '/admin/designs' + path;
    };

    // this is the API
    this.router.post(getApiPath('/upload'),
                     DesignAPIController.uploadDesign());
    this.router.get(getApiPath(''),
                    DesignAPIController.getDesigns);
    this.router.get(getApiPath('/approved'),
                    DesignAPIController.getAllApprovedDesigns);
    this.router.get(getApiPath('/:id'),
                    DesignAPIController.getDesignByID);

    // this is for CMS
    this.router.get(getAdminPath(''), DesignController.index);
    this.router.get(getAdminPath('/approvedList'),
                    DesignController.approvedPage);
    this.router.get(getAdminPath('/pinnedList'),
                    DesignController.pinnedPage);
    this.router.get(getAdminPath('/rejectedList'),
                    DesignController.rejectedPage);
    this.router.get(getAdminPath('/pendingList'),
                    DesignController.pendingPage);
    this.router.get(getAdminPath('/approve/:id'), DesignController.approve);
    this.router.get(getAdminPath('/reject/:id'), DesignController.reject);

    this.router.get(getAdminPath('/pin/:id'), DesignController.pin);
    this.router.get(getAdminPath('/unpin/:id'), DesignController.unpin);

    return this.router;
  }
}

export default DesignControllerRouter;
