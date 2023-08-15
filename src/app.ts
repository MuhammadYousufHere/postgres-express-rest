import express, { Request, Response } from 'express'
import stoppable from 'stoppable'
import config from 'config'
import responseTime from 'response-time'
import dayjs from 'dayjs'
import cors from 'cors'
import helmet from 'helmet'
import cookiesParser from 'cookie-parser'
//utils
import logger from './utils/logger'
import { getDB, waitDBConnect } from './utils/db-client'
import { errorHandler } from './middleware/errorHandlers'
import path from 'path'

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

// built-in middleware for json
app.use(express.json())
app.use(cors())
app.use(helmet())
//middleware for cookies
app.use(cookiesParser())
//serve static files
app.use('/', express.static(path.join(__dirname, '/public')))

app.use(
  responseTime((req: Request, _res: Response, time: number) => {
    if (req.route?.path) {
      console.log(time * 1000)
    }
  })
)
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
GET('/users/init', () => getDB(dbUri).users.init())
GET('/users/drop', () => getDB(dbUri).users.drop())

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

app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if (req.accepts('json')) {
    res.json({ error: '404 Not Found' })
  } else {
    res.type('txt').send('404 Not Found')
  }
})

app.use(errorHandler)
app.listen(port, async () => {
  logger.info(` ⚡️ App is up and running on port localhost:${port}`)
  return waitDBConnect(getDB(dbUri))
    .then(() => {})
    .catch(err => {
      logger.error(`Failed to connect DB : ${err.stack}`)
      process.exit(1)
    })
})
