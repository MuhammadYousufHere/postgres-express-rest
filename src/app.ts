import express, { Request, Response } from 'express'
import stoppable from 'stoppable'
import { Pool } from 'pg'
import config from 'config'
import responseTime from 'response-time'
import dayjs from 'dayjs'
import cors from 'cors'

//utils
import logger from './utils/logger'

const pool = new Pool({
  port: 5432,
  host: 'localhost',
  user: '',
  password: '',
  database: '',
})
const port = config.get('port')
const app = express()

app.use(express.json())
app.use(cors())

app.listen(port, async () => {
  logger.info(`⚡️App in up and running on port localhost:${port}`)
})

app.use('/status', (_req: Request, res: Response) => {
  res.json({
    message: 'api is running',
    timestamp: dayjs().format('YYYY-MM-DD HH:mm:ssZ'),
  })
})
