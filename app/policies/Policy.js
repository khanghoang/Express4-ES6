import ConnectRoles from 'connect-roles';

class Policy {

  /*
   * Init all the policies for authorizations
   * @public
   * @param exp Express instance
   * @param role ConnectRoles instance
   * This function need to be called after the passport
   */
  static initPolicies = (exp, roles: ConnectRoles) => {
    exp.use(roles.middleware());

    // admin role
    roles.use('admin', function(req) {
      if (_.get(req, 'session.passport.user.role', null) === 'admin') {
        return true;
      }

      return false;
    });

  }
}

export default Policy;
