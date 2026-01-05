export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  jwt: {
    secret: process.env.JWT_SECRET || 'changeme',
    expiration: process.env.JWT_EXPIRATION || '1h',
  },
  database: {
    url: process.env.DATABASE_URL,
  },
});
