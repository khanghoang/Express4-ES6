import AuthController from '../controllers/AuthController';
import RouterMixin from './_decorators/routerHelper';

const Router = Object.assign({}, RouterMixin, {
  _router: function() {
    return {
      '/login': {
        get: {
          handler: AuthController.login
        },
        post: {
          handler: AuthController.process
        }
      },
      '/logout': {
        get: {
          handler: AuthController.doLogout
        }
      },
      '/admin': {
        get: {
          handler: function(req, res) {
            res.redirect('/admin/designs/pendingList');
          }
        }
      }
    }
  }
});

export default Router;
