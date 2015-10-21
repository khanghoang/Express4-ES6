import {Router as router} from 'express';
import AuthController from '../controllers/AuthController';

class AuthControllerRouter {
  static route() {
    this.router = router();

    this.authController = new AuthController();

    // this is the route
    this.router.get('/login', this.authController.login);
    this.router.get('/logout', this.authController.logout);

    return this.router;
  }
}

export default AuthControllerRouter;
