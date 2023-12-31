import { Users } from '../src/db/user'

//add all the tables here
export interface IExtensions {
  users: Users
}
export interface IUser {
  email: string
  password: string
}

export * from './request'
export * from './urlParams'
