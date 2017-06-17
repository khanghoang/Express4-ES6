const config = {
  server: {
    port: 3210,
    hostname: 'localhost'
  },

  s3: {
    secretAccessKey: process.env.SECRET_ACCESS_KEY || '',
    accessKeyId: process.env.ACCESS_KEY_ID || '',
  },

  database: {
    url: 'mongodb://localhost/database_test'
  }
};

export default config;
