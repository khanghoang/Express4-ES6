import {Router as router} from 'express';
import DesignController from '../controllers/api/v1/DesignController';

class DesignControllerRouter {
  static route() {
    this.router = router();

    // this is the route
    this.router.post('/v1/design/upload', DesignController.uploadDesign());
    this.router.get('/v1/design', DesignController.getDesigns);

    return this.router;
  }
}

export default DesignControllerRouter;
