import {Router as router} from 'express';
import AuthController from '../controllers/AuthController';

class AuthControllerRouter {
  static route() {
    this.router = router();

    // this is the route
    this.router.get('/login', AuthController.login);
    this.router.get('/logout', AuthController.logout);

    return this.router;
  }
}

export default AuthControllerRouter;
