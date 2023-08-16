import { Request } from 'express'
import bcrypt from 'bcrypt'

import jwt from 'jsonwebtoken'

const secret: string = process.env.JWT_SECRET!

/**
 * Returns hashed password string using preferred crypto
 * @param plainTextPassword
 */
export const hashPassword = async (plainTextPassword: string): Promise<string> => {
  return bcrypt.hash(plainTextPassword, 10)
}

/**
 * Returns true if hashed version of plain text matches hashed version
 * @param plainTextPassword
 * @param hashedPassword
 */
export const verifyPassword = async (plainTextPassword: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(plainTextPassword, hashedPassword)
}

/**
 * Returns payload of token after decrypting
 * @param token
 */
export const readToken = (token: string): any => {
  return jwt.verify(token, secret)
}

/**
 * Returns payload of token after decrypting
 * @param token
 */
export const decodeToken = (token: string): any => {
  return jwt.decode(token)
}

/**
 * Extracts token from wherever we expect (header)
 * @param request
 */
export const parseToken = (request: Request) => {
  let foundToken: string | null = null

  if (request && request.headers && request.headers.authorization) {
    const parts = request.headers.authorization.split(' ')
    if (parts.length === 2) {
      const scheme: string = parts[0]
      const credentials: string = parts[1]

      if (/^Bearer$/i.test(scheme)) {
        foundToken = credentials
      }
    }
  }

  return foundToken
}
