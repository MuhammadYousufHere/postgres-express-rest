import { Response, NextFunction } from 'express'
import UAParser from 'ua-parser-js'
import logger from '../../config/logger'
import { RequestWithUser } from '../../@types'

/**
 * Parse user agent data from header and add to Request
 * @param request
 * @param response
 * @param next
 */
export function addUserAgent(req: RequestWithUser, _res: Response, next: NextFunction) {
  try {
    req.userAgent = new UAParser(req.headers['user-agent']).getResult()
    next()
  } catch (err) {
    logger.error(`Could not determine user agent`)
    next()
  }
}
