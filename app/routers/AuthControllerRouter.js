import {Router as router} from 'express';
import AuthController from '../controllers/AuthController';

const Router = {

  _mapRoute: function(parentPath, routeObject) {
    var r = router();
    // for the route path
    for (let path in routeObject) {
      // verb, such as GET, POST...
      for (let verb in routeObject[path]) {
        // map them to app
        r[verb](parentPath + path, routeObject[path][verb].handler);
      }
    }
    return r;
  },

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
  },

  route: function(path) {
    path = path || '';
    var r = this._router();
    return this._mapRoute(path, r);
  }
}

export default Router;
