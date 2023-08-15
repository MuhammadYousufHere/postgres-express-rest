import _ from 'lodash'
import type { IDatabase } from 'pg-promise'
import { pgP } from './db-client'
import type { IUser } from '../../@types'

const insertSupportCol: Array<string> = ['email', 'password']

export async function InsertUser(
  conn: IDatabase<unknown>,
  user: IUser
): Promise<{ id: number; createAt: Date; updatedAt: Date }> {
  const newUser = _.pick(user, insertSupportCol)
  const insertStatemenet = `${pgP.helpers.insert(
    newUser,
    Object.keys(newUser),
    'users'
  )} RETURNING user_id, created_at as "createAt, updated_at as "updatedAt"`

  return conn.one(insertStatemenet).catch((err: Error) => {
    throw new Error(`Failed inserting user with data ${JSON.stringify(user)}: ${err.stack}`)
  })
}
