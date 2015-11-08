const config = {
  server: {
    port: process.env.PORT,
    hostname: 'localhost'
  },

  s3: {
    secretAccessKey: process.env.SECRET_ACCESS_KEY || 'WY9HsXfYXMHfxebntOeQfRiexF03tHPReoQOh5YI',
    accessKeyId: process.env.ACCESS_KEY_ID || 'AKIAIE6SUIZCTS3DO4PA',
  },

  database: {
    url: process.env.DATABASE_URL || 'mongodb://localhost/database'
  }
};

export default config;
