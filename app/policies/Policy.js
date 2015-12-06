import ConnectRoles from 'connect-roles';

class Policy {

  /**
   * Get role from passport
   * @return {Role} String
   */
  static _getRole = (req) : string => {
    return _.get(req, 'session.passport.user.role', '');
  }

  /*
   * Init all the policies for authorizations
   * @public
   * @param exp Express instance
   * @param role ConnectRoles instance
   * This function need to be called after the passport
   */
  static initPolicies = (exp, connectRoles: ConnectRoles) => {
    exp.use(connectRoles.middleware());

    var roles = ['admin', 'user', 'manager'];

    // make connect roles for all roles above
    _.forEach(roles, function(role) {
      connectRoles.use(role, function(req) {
        if (Policy._getRole(req) === role) {
          return true;
        }
        return false;
      });
    });
  }
}

export default Policy;
