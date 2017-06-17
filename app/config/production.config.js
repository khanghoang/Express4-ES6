const config = {
  server: {
    port: process.env.PORT,
    hostname: 'localhost'
  },

  s3: {
    secretAccessKey: process.env.SECRET_ACCESS_KEY || '',
    accessKeyId: process.env.ACCESS_KEY_ID || '',
  },

  database: {
    url: process.env.DATABASE_URL || 'mongodb://localhost/database'
  }
};

export default config;
