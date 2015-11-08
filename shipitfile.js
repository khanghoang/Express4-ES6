module.exports = function (shipit) {
  require('shipit-deploy')(shipit);

  shipit.initConfig({
    default: {
      workspace: '../shipit-temp-folder',
      deployTo: '~/express4-es6',
      branch: "develop",
      repositoryUrl: 'https://github.com/khanghoang/express4-es6.git',
      ignores: ['.git', 'node_modules'],
      rsync: ['--del'],
      keepReleases: 10,
      key: '~/Documents/Certs/khanghoang.pem',
      shallowClone: true
    },
    staging: {
      servers: {
        host: '54.251.129.55',
        user: 'ubuntu'
      }
    },
    test: {
      branch: 'shipit',
      servers: {
        host: '54.179.191.102',
        user: 'ubuntu'
      }
    },
  });

  shipit.blTask('npm', function () {
    return shipit.remote('cd ~/express4-es6/current/ && /opt/node/bin/npm install');
  });

  shipit.blTask('installGulp', function () {
    return shipit.remote('cd ~/express4-es6/current/ && /opt/node/bin/npm install gulp --save && /opt/node/bin/npm install gulp-cli --save');
  });

  shipit.blTask('babel', function () {
    return shipit.remote('cd ~/express4-es6/current/ && /opt/node/bin/gulp babel');
  });

  shipit.on('published', function () {
    shipit.start(['npm', 'installGulp','babel', 'pm2']);
  });

  shipit.blTask('pm2', function () {
    return shipit.remote('cd ~/express4-es6/ && pwd && /opt/node/bin/pm2 startOrGracefulReload secret.json');
  });
};
