import bcrypt from 'bcrypt'
import type { IDatabase } from 'pg-promise'

import config from 'config'
import { IUser } from '../../@types'
import { InsertUser } from '../utils/user'

const saltRounds = config.get<number>('saltRounds')

export async function signUp(context: IDatabase<unknown>, values: IUser) {
  const newBcryptPassword = await bcrypt.hash(values.password, saltRounds)
  const newUser = { email: values.email, password: newBcryptPassword }
  return InsertUser(context, newUser)
}

export async function login(_context: IDatabase<unknown>, _values: IUser) {
  throw new Error('Login implementation is not handled')
}
