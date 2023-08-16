import 'express-async-errors'
import { Request, Response, NextFunction } from 'express'
import createHttpError, { type HttpError, isHttpError } from 'http-errors'
import log from '../utils/logger'

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  let error: HttpError
  if (isHttpError(err)) {
    error = err
  } else {
    log.error(`Internal server error: ${err.message}`)
    error = createHttpError(500, err.message ?? 'Unexpected error')
  }
  const formatedError = {
    message: error.message,
    name: error.name,
    status: error.status,
  }
  res.status(error.statusCode).send(formatedError)
}
