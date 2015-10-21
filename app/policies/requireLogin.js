import _ from 'lodash';

let requireLogin = (req, res, next) => {
  // User is allowed, proceed to controller
  var isAuth = !!_.get(req, 'session.passport.user', null);
  if (isAuth) {
    return next();
  }
  // User is not allowed
  return res.redirect('/login');
};

export default requireLogin;
