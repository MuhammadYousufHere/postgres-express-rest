/*
  Here we typed in simple models manually. But there are many tools out there
  for generating database models automatically, from an existing database.

  For example, schemats: https://github.com/sweetiq/schemats
*/

export interface MUser {
  user_id: number
  username: string
  email: string
  password: string
  email_verified: boolean
}
