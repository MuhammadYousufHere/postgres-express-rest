import { IDatabase, IMain } from 'pg-promise'
import { IResult } from 'pg-promise/typescript/pg-subset'
import type { MUser } from '../src/models/users'
import { products as sql } from './sql'

export class Products {
  constructor(
    private db: IDatabase<any>,
    private pgp: IMain
  ) {}
}
