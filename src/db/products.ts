import { IDatabase, IMain } from 'pg-promise'
import { IResult } from 'pg-promise/typescript/pg-subset'
import type { MUser } from '../models/users'
import { products as sql } from '.'

export class Products {
  constructor(
    private db: IDatabase<any>,
    private pgp: IMain
  ) {}
}
