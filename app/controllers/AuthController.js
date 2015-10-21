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
    console.log('process');
    console.log(req.body);
    passport.authenticate('local', function(err, user, info) {
      console.log('info', info);
      console.log('err', err);
      console.log('user', user);
      if (err || !user) {
        return res.send({
          message: 'login failed'
        });
      }

      req.logIn(user, function(loginError) {
        console.log(loginError);
        if (loginError) {
          return res.send(err);
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
