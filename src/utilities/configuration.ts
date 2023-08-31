export default {
  port: parseInt(process.env.PORT) || 4000,
  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    tokenExpiration: parseInt(process.env.JWT_EXPIRATION) || 3600,
    refreshExpiration:
      parseInt(process.env.JWT_REFRESH_EXPIRATION) || 2_592_000,
  }
};
