import { IDatabase, IMain } from 'pg-promise'
import { IResult } from 'pg-promise/typescript/pg-subset'
import type { MUser } from '../src/models/users'
import { users as sql } from './sql'

export class Users {
  constructor(
    private db: IDatabase<any>,
    private pgp: IMain
  ) {}
  // create the table
  create(): Promise<null> {
    return this.db.none(sql.create)
  }
  // Initializes the table with some user records, and return their id-s;
  init(): Promise<number[]> {
    return this.db.map(sql.init, [], (row: { user_id: number }) => row.user_id)
  }
  drop(): Promise<null> {
    return this.db.none(sql.init)
  }
}
