import pgPromise, { IEventContext, IDatabase, IInitOptions, IMain } from 'pg-promise'
import asyncRetry from 'async-retry'
import log from './logger'
import { IExtensions } from '../../@types'
import { Diagnostic } from './diagnostic'
import { Users } from '../../db/user'

type ExtendedProtocol = IDatabase<IExtensions> & IExtensions

const pgConfig: IInitOptions<IExtensions> = {
  capSQL: true,
  noWarnings: true,
  query: (e: IEventContext) => {
    if (Number(process.env.SHOW_SQL) === 1) {
      console.log(e.query)
    }
  },
  extend(obj: ExtendedProtocol, _dc: any) {
    obj.users = new Users(obj, pgP)
  },
}

// Initializing the library
const pgP: IMain = pgPromise(pgConfig)

pgP.pg.defaults.max = 50 // set pool size to 50

function getDB(cn: string): ExtendedProtocol {
  return pgP(cn)
}

// Initializing optional diagnostics
Diagnostic.init(pgConfig)

function waitDBConnect(db: IDatabase<any>, retries = 5) {
  return asyncRetry(
    async () => {
      const connection = await db.connect()
      await connection.done()
      log.info('DB Connected!')
      return connection
    },
    { retries }
  )
}

export { waitDBConnect, pgP, getDB }
