import passport from 'passport';
import login from 'connect-ensure-login';

class OAuth2ServerController {
  index(res) {
    res.send('OAuth 2 server');
  }

  loginForm(res) {
    res.render('view/login');
  }

  login() {
    return passport.authenticate('local',
                                 {successReturnToOrRedirect: '/',
                                   failureRedirect: '/login'});
  }

  logout(res, req) {
    req.logout();

  }

  account() {
    return [
      login.ensureLoggedIn(),
      function(req, res) {
        res.render('account', {user: req.user});
      }
    ];
  }
}

export default OAuth2ServerController;
