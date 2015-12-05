import {Router} from 'express';
const RouterHelper = {
  _mapRoute: function(parentPath, routeObject) {
    var r = Router();
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

  // prefix path
  route: function() {
    let parentPath = this.prefix || '';
    var r = this._router();
    return this._mapRoute(parentPath, r);
  }
}

export default RouterHelper;
