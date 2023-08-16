import pgPromise, { IEventContext, IDatabase, IInitOptions, IMain } from 'pg-promise'
import asyncRetry from 'async-retry'
import log from '../src/utils/logger'
import { IExtensions } from '../@types'
import { Diagnostic } from '../src/utils/diagnostic'
import { Users } from '../src/db/user'

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
  // connect(e) {
  //   const cp = e.client.connectionParameters
  //   log.info('Connected to database', cp.database)

  // },
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
      const connection = await db.connect({ direct: true })
      await connection.done()
      log.info('Connected to database')

      return connection
    },
    { retries }
  )
}

export { waitDBConnect, pgP, getDB }
