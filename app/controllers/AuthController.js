import passport from 'passport';

class AuthController {
  static login = (req, res) => {
    res.render('oauth/login', {
    });
  }

  static logout = (req, res) => {
    res.render('oauth/logout', {
    });
  }

  static process = (req, res, next) => {
    passport.authenticate('local', function(err, user, info) {
      if (err || !user) {
        return res.status(401).send({
          message: 'login failed'
        });
      }

      req.logIn(user, function(loginError) {
        if (loginError) {
          return res.status(401).send(err);
        }
        return res.send({
          message: 'login successful'
        });
      });

    })(req, res, next);
  }

  static doLogout = (req, res) => {
    req.logout();
    res.send('Logout successfully');
  }
}

export default AuthController;
