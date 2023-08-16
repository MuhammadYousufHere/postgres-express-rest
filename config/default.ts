import 'dotenv/config'

export default {
  port: process.env.PORT || 1234,
  host: process.env.HOST || '0.0.0.0',
  saltRounds: process.env.BCRYPT_SALT_ROUNDS ? parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) : 10,
  dbUri: process.env.DB_CONNECTION,
  logLevel: process.env.LOG_LEVEL || 'info',
  accessTokenSecret: process.env.ACCESS_TOKEN_PRIVATE_KEY,
}
