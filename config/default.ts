import 'dotenv/config'

export default {
  port: process.env.PORT || 1234,
  saltRounds: process.env.BCRYPT_SALT_ROUNDS ? parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) : 10,
  dbUri: process.env.DB_CONNECTION,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
}
