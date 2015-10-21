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

  static process = (req, res) => {
    passport.authenticate('local', function(err, user, info) {
      console.log(info);
      if (err || !user) {
        return res.send({
          message: 'login failed'
        });
      }

      req.logIn(user, function(loginError) {
        if (loginError) {
          return res.send(err);
        }
        return res.send({
          message: 'login successful'
        });
      });
    })(req, res);
  }

  static doLogout = (req, res) => {
    req.logout();
    res.send('Logout successfully');
  }
}

export default AuthController;
