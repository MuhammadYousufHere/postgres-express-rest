import 'dotenv/config'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import config from 'config'

const sercret = config.get<string>('accessTokenSecret')

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = (req.headers.authorization || req.headers.Authorization) as string
  if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401)
  const accessToken = authHeader.split(' ')[1]
  jwt.verify(accessToken, sercret, (err: jwt.VerifyErrors | null, _decoded) => {
    if (err) return res.sendStatus(403) //invalid token
    // req.user = decoded.UserInfo.username
    // req.roles = decoded.UserInfo.roles
    next()
  })
}
