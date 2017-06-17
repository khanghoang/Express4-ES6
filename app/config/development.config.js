const config = {
  server: {
    port: 3000,
    hostname: 'localhost'
  },

  s3: {
    secretAccessKey: process.env.SECRET_ACCESS_KEY | '',
    accessKeyId: process.env.ACCESS_KEY_ID || '',
  },

  database: {
    url: 'mongodb://localhost:27017/database'
  }
};

export default config;
