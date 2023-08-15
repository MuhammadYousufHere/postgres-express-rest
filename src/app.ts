import express, { Request, Response } from 'express'
import stoppable from 'stoppable'
import config from 'config'
import responseTime from 'response-time'
import dayjs from 'dayjs'
import cors from 'cors'

//utils
import logger from './utils/logger'
import { getDB, waitDBConnect } from './utils/db-client'

// const pool = new Pool({
//   port: 5432,
//   host: 'localhost',
//   user: 'root',
//   password: 'password123@',
//   database: 'my-pg-db',
// })
const app = express()

const port = config.get<number>('port')
const dbUri = config.get<string>('dbUri')

app.use(express.json({}))
app.use(cors())

function shutDown() {}
function start() {
  process.on('unhandledRejection', (error: any, promise) => {
    logger.error(`unhandledRejection at: ${promise} `, {
      stack: error.stack,
      error: JSON.stringify(error),
    })
  })

  process.on('uncaughtException', error => {
    logger.error(`uncaughtException: ${error.message}`, {
      stack: error.stack,
      error: JSON.stringify(error),
    })
  })
}

//create table users
GET('/users/create', () => getDB(dbUri).users.create())

app.use('/status', (_req: Request, res: Response) => {
  res.json({
    message: 'api is running',
    timestamp: dayjs().format('YYYY-MM-DD HH:mm:ssZ'),
  })
})

// Generic GET handler;
function GET(url: string, handler: (req: any) => any) {
  app.get(url, async (req: Request, res: Response) => {
    try {
      const data = await handler(req)
      res.json({
        success: true,
        data,
      })
    } catch (error: any) {
      res.json({
        success: false,
        error: error.message || error,
      })
    }
  })
}

app.listen(port, async () => {
  logger.info(` ⚡️ App is up and running on port localhost:${port}`)
  return waitDBConnect(getDB(dbUri))
    .then(db => {
      console.log(db.client.user)
    })
    .catch(err => {
      logger.info(`Failed to connect DB : ${err.stack}`)
      process.exit(1)
    })
})
