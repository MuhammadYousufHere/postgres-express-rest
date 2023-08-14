import pgPromise, { IEventContext, IDatabase, IInitOptions } from 'pg-promise'
import asyncRetry from 'async-retry'

const pgConfig: IInitOptions = {
  capSQL: true,
  noWarnings: true,
  query: (e: IEventContext) => {
    if (Number(process.env.SHOW_SQL) === 1) {
      console.log(e.query)
    }
  },
}

const pgP = pgPromise({
  ...pgConfig,
})

pgP.pg.defaults.max = 50 // set pool size to 50

function getDB(cn: string) {
  return pgP(cn)
}

function waitDBConnect(db: IDatabase<any>, retries = 5) {
  return asyncRetry(
    async () => {
      const connection = await db.connect()
      await connection.done()
      return connection
    },
    { retries }
  )
}

export { waitDBConnect, pgP, getDB }
