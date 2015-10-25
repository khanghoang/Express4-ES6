import passport from 'passport';
import _ from 'lodash';

class AuthController {
  static login = (req, res) => {
    if (_.get(req, 'session.passport.user', null)) {
      return res.redirect('/admin');
    }

    return res.render('oauth/login', {
    });
  }

  static logout = (req, res) => {
    res.render('oauth/logout', {
    });
  }

  static process = (req, res, next) => {
    // there is 'info' parameter as 3rd one but we don't
    // need it for now
    passport.authenticate('local', function(err, user) {
      if (err || !user) {
        return res.status(401).send({
          message: 'login failed'
        });
      }

      req.logIn(user, function(loginError) {
        if (loginError) {
          return res.status(401).send(err);
        }

        res.redirect('/admin');
      });

    })(req, res, next);
  }

  static doLogout = (req, res) => {
    req.session.destroy(function() {
      res.redirect('/login');
    });
  }
}

export default AuthController;
