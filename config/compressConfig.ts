import { Request, Response } from 'express'
import { filter } from 'compression'

export const shouldCompress = (req: Request, res: Response) => {
  if (req.headers['x-no-compression']) {
    // don't compress responses if this request header is present
    return false
  }

  // fallback to standard compression
  return filter(req, res)
}
