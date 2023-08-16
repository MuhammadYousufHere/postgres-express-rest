import express, { Request, Response } from 'express'
import stoppable, { StoppableServer } from 'stoppable'
import config from 'config'
import responseTime from 'response-time'
import dayjs from 'dayjs'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import cookiesParser from 'cookie-parser'
import path from 'path'

//utils
import logger from './utils/logger'
import { getDB, waitDBConnect } from '../config/db-client'
import { errorHandler } from './middleware/errorHandlers'
import { corsOptions } from '../config/corsOptions'
import { shouldCompress } from '../config/compressConfig'
import { validateEnv } from './utils/validation'

const killSignals = {
  SIGHUP: 1,
  SIGINT: 2,
  SIGUSR2: 12,
  SIGTERM: 15,
}

validateEnv()

const app = express()

const port = config.get<number>('port')
const host = config.get<string>('host')
const dbUri = config.get<string>('dbUri')

// built-in middleware for json
app.use(express.json())
//cors middlware
app.use(cors(corsOptions))

//
app.use(compression({ filter: shouldCompress, threshold: 0 }))
/**
 * Adds security middleware to app
 */
app.use(helmet({ noSniff: true, xssFilter: true, ieNoOpen: true, hsts: true, frameguard: true, hidePoweredBy: true }))

//middleware for cookies
app.use(cookiesParser())

app.use(errorHandler)

app.set('json spaces', 2)
//serve static files
app.use('/', express.static(path.join(__dirname, '../public')))

// use for computing processing time on response
app.use(
  responseTime((req: Request, _res: Response, time: number) => {
    if (req.route?.path) {
      console.log(time * 1000)
    }
  })
)

// close server
function shutdown(nodeApp: StoppableServer, signal: string, value: number) {
  logger.info(`Trying shutdown, got signal ${signal}`)
  nodeApp.stop(() => {
    logger.info('Server stopped gracefuly.')
    getDB(dbUri).$pool.end()
    logger.info('DB connections stopped.')
    process.exit(128 + value)
  })
}

// start app
// has arg of context
function start() {
  const nodeApp = stoppable(
    app.listen({ port, host }, async () => {
      logger.info(` ⚡️ App is up and running at http://${host}:${port}`)
    })
  )

  nodeApp.timeout = 0
  nodeApp.keepAliveTimeout = 6000 // 60 secs

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
  process.once('SIGUSR2', () => shutdown(nodeApp, 'SIGUSR2', killSignals.SIGUSR2))
  process.once('SIGHUP', () => shutdown(nodeApp, 'SIGHUP', killSignals.SIGHUP))
  process.once('SIGINT', () => shutdown(nodeApp, 'SIGINT', killSignals.SIGINT))
  process.once('SIGTERM', () => shutdown(nodeApp, 'SIGTERM', killSignals.SIGTERM))
  return nodeApp
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

waitDBConnect(getDB(dbUri))
  .then(start)
  .catch(err => {
    logger.error(`Error while connecting to the database : ${err.stack}`)
    logger.error(`Failed to start services : ${err.stack}`)
    process.exit(1)
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
