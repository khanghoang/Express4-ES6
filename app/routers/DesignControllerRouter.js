import {Router as router} from 'express';
import DesignController from '../controllers/api/v1/DesignController';

class DesignControllerRouter {
  static route() {
    this.router = router();

    // this is the route
    // this.router.post('/v1/design/upload', function(req, res) {
      // res.send('abc')
    // });
    this.router.post('/v1/design/upload', DesignController.uploadDesign());

    return this.router;
  }
}

export default DesignControllerRouter;
