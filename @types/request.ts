import { Request } from 'express'
import { IUser } from './index'
import { URLParams } from './urlParams'

export interface RequestWithUser extends Request {
  user: IUser
  startTime?: number
  userAgent?: { [key: string]: any }
  searchParams?: URLParams
}
