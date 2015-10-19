import OAuth2orize from 'oauth2orize';
import Passport from 'passport';
import ClientManager from '../managers/ClientManager';
import AuthorizationCodeManager from '../managers/AuthorizationManager';
import login from 'connect-ensure-login';
import utils from './utils';

class OAuth2Server {
  static sharedInstance(opt) {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new OAuth2Server(opt);
    this.server = OAuth2orize.createServer();
    return this.instance;
  }

  constructor(opt) {
    // default
    opt = opt || {};
    let oauth2orize = opt.oauth2orize || OAuth2orize;
    let passport = opt.passport || Passport;
    let clientManager = opt.clientManager || ClientManager;
    let authorizationCodeManager = opt.authorizationCodeManager ||
      AuthorizationCodeManager;

    this.oauth2orize = oauth2orize;
    this.passport = passport;
    this.clientManager = clientManager;
    this.authorizationCodeManager = authorizationCodeManager;

    this.instance = {};
  }

  run() {
    this.server.serializeClient((client, done) => {
      return done(null, client._id);
    });

    this.server.deserializeClient((id, done) => {
      this.clientManager.find(id, (err, clients) => {
        if (err) {
          return done(err);
        }
        return done(null, clients);
      });
    });

    this.server.grant(
      OAuth2orize.grant.code((client, redirectURI, user, ares, done) => {
        let code = utils.uid(16);

        AuthorizationCodeManager.save(
          code,
          client._id,
          redirectURI,
          user._id,
          (err) => {
            if (err) {
              return done(err);
            }
            done(null, code);
          });
      })
    );

    this.server.exchange(OAuth2orize.exchange.code(
      function(client, code, redirectURI, done) {
        AuthorizationCodeManager.find(code, function(err, authCode) {
          if (err) {
            return done(err);
          }

          if (!authCode) {
            return done(null, false);
          }

          if (client._id !== authCode.client) {
            return done(null, false);
          }

          if (redirectURI !== authCode.redirectURI) {
            return done(null, false);
          }

          AuthorizationCodeManager.delete(code, function() {
            if (err) {
              return done(err);
            }
            let token = utils.uid(256);
            AuthorizationCodeManager.save(
              token,
              authCode.user,
              authCode.client,
              function(savingError) {
                if (savingError) {
                  return done(savingError);
                }
                done(null, token);
              });
          });
        });
      }));
  }

  authorization = () => {
    return [
      login.ensureLoggedIn(),
      this.server.authorization(function(clientID, redirectURI, done) {
        ClientManager.findByClientID(clientID, function(err, client) {
          if (err) {
            return done(err);
          }
          return done(null, client, redirectURI);
        });
      }),
      function(req, res) {
        res.render('dialog', {
          transactionID: req.oauth2.transactionID,
          user: req.user,
          client: req.oauth2.client
        });
      }
    ];
  }

  decision = () => {
    return [
      login.ensureLoggedIn(),
      this.server.decision()
    ];
  }

  token = () => {
    return [
      Passport.authenicate(['basic', 'oauth2-client-password'], { session: false }),
      this.server.token(),
      this.server.errorHandler()
    ];
  }
}

export default OAuth2Server;
