import { Response, NextFunction } from 'express'
import { URLParams, RequestWithUser } from '../../@types'
import logger from '../../config/logger'

export function addSearchParams(req: RequestWithUser, _res: Response, next: NextFunction) {
  try {
    const qParams: URLParams = req.query

    const { q, sort, offset, limit, from, to } = qParams

    const params: URLParams = {}

    if (q) {
      params.q = q
    }
    if (limit) {
      params.limit = limit
    }
    if (offset) {
      params.offset = offset
    }
    if (from) {
      params.from = from
    }
    if (to) {
      params.to = to
    }
    if (sort) {
      params.sort = sort
    }

    req.searchParams = params
    next()
  } catch (err) {
    logger.warn(`Could not parse the query params`)
    next()
  }
}
