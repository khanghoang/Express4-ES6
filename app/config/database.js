import config from './config';

const connectToDatabase = (app, mongoose) => {
  GLOBAL.Mongoose = mongoose;
  const connect = () => {
    let options = {
      server: {
        socketOptions: {keepAlive: 1}
      },
      auto_reconnect: true //eslint-disable-line
    };

    mongoose.connect(config.database.url, options);
  };

  connect();

  mongoose.connection.on('error', (err) => {
    console.error('✗ MongoDB Connection Error. Please make \
                  sure MongoDB is running. -> ' + err);
  });

  mongoose.connection.on('connected', () => {
    console.error('Connect to DB...');
  });

  mongoose.connection.on('disconnect', () => connect());
};

export default connectToDatabase;
