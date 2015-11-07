module.exports = function (shipit) {
  require('shipit-deploy')(shipit);

  shipit.initConfig({
    default: {
      workspace: '../shipit-temp-folder',
      deployTo: '~/express4-es6',
      repositoryUrl: 'https://github.com/khanghoang/express4-es6.git',
      ignores: ['.git', 'node_modules'],
      rsync: ['--del'],
      keepReleases: 4,
      key: '~/Documents/Certs/khanghoang.pem',
      shallowClone: true
    },
    staging: {
      servers: 'ubuntu@54.179.135.31'
    }
  });

  shipit.on('cleaned', function () {
    return shipit.start(['cd', 'npm', 'installGulp', 'babel']);
  });

  shipit.blTask('cd', function () {
    return shipit.remote('cd ~/express4-es6');
  });

  shipit.blTask('npm', function () {
    return shipit.remote('cd ~/express4-es6 && npm install');
  });

  shipit.blTask('installGulp', function () {
    return shipit.remote('npm install gulp-cli --save');
  });

  shipit.blTask('babel', function () {
    return shipit.remote('gulp babel');
  });
};
