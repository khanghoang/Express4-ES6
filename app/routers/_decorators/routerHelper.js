import {Router} from 'express';
const RouterHelper = {
  _mapRoute: function(parentPath, routeObject, connectRole) {
    let r = Router();
    // for the route path
    for (let path in routeObject) {
      // verb, such as GET, POST...
      for (let verb in routeObject[path]) {
        // add authorization
        let role = routeObject[path][verb].role;
        if (role) {
          r[verb](parentPath + path, this._middlewareRole(connectRole, role));
        }
        // map them to app
        r[verb](parentPath + path, routeObject[path][verb].handler);
      }
    }
    return r;
  },

  _middlewareRole: function(connectRoles, role) {
    return connectRoles.can(role);
  },

  // prefix path
  route: function(connectRole) {
    let parentPath = this.prefix || '';
    let r = this._router();
    return this._mapRoute(parentPath, r, connectRole);
  }
}

export default RouterHelper;
