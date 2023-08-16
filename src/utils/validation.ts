import 'dotenv/config.js'
import { num, str, cleanEnv, port, url } from 'envalid'

/**
 * Checks whether required environment variables are present for application
 */

export const validateEnv = () =>
  cleanEnv(process.env, {
    POSTGRES_DB: str(),
    POSTGRES_HOST: str(),
    POSTGRES_PASSWORD: str(),
    POSTGRES_PORT: port(),
    POSTGRES_USER: str(),
    DB_CONNECTION: str(),
    PORT: port(),
    JWT_SECRET: str(),
    LOG_LEVEL: str(),
    SHOW_SQL: num(),
    BCRYPT_SALT_ROUNDS: num(),
    REDIS_URL: str(),
  })
