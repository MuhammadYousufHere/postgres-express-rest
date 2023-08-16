import { join } from 'path'
import { QueryFile, type IQueryFileOptions } from 'pg-promise'
import logger from '../utils/logger'

export const products = {}

function sql(file: string): QueryFile {
  const fullPath: string = join(__dirname, file) //generate file path
  const options: IQueryFileOptions = {
    // minifying the SQL is always advised;
    // see also option 'compress' in the API;
    minify: true,
    // See also property 'params' for two-step template formatting
  }
  const qf: QueryFile = new QueryFile(fullPath, options)
  if (qf.error) {
    logger.error(qf.error)
  }
  return qf
}
export const users = {
  create: sql('sql/users/create.sql'),
  init: sql('sql/users/init.sql'),
  drop: sql('sql/users/drop.sql'),
}
