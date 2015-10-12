class BaseExpressConfig {

  config(app) {
    var allowCrossDomain = (req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Credentials', true);
      res.header('Access-Control-Allow-Headers', 'X-Requested-With');
      next();
    };

    app.use(allowCrossDomain);
  }
}

export default new BaseExpressConfig();
