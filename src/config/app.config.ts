export const appConfig = () => ({
  port: process.env.PORT,
  database: {
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME
  },
  jwt: {
    ACCESS_TOKEN_EXPIRES: process.env.ACCESS_TOKEN_EXPIRES,
    REFRESH_TOKEN_EXPIRES: process.env.REFRESH_TOKEN_EXPIRES
  },
  redisStore: {
    host: process.env.REDIS_STORE_HOST,
    port: Number(process.env.REDIS_STORE_PORT),
    ttl: Number(process.env.REDIS_STORE_TTL),
  }
})