const config = {
  server: {
    port: process.env.PORT,
    hostname: 'localhost'
  },

  database: {
    url: process.env.DATABASE_URL
  }
};

export default config;
