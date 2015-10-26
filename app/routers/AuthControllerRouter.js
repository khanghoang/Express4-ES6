import {Router as router} from 'express';
import AuthController from '../controllers/AuthController';

class AuthControllerRouter {
  static route() {
    this.router = router();

    // this is the route
    this.router.get('/login', AuthController.login);
    this.router.get('/logout', AuthController.doLogout);
    this.router.post('/login', AuthController.process);

    this.router.get('/admin', function(req, res) {
      res.redirect('/admin/designs/pendingList');
    });

    return this.router;
  }
}

export default AuthControllerRouter;
