import { Request, Response, Router } from 'express'
import type { IDatabase } from 'pg-promise'
import { validateSignup } from '../validation/signup'
import { signUp } from '../services/user'

/**
 * Signup user
 * method - POST
 */
export function getUserRoutes(conn: IDatabase<unknown>) {
  const router = Router()

  router.post('/', async function (req: Request, res: Response) {
    try {
      const errors = validateSignup(req.body)
      if (errors.length > 0) {
        return res.status(400).send({ errors })
      }
      const addNewUser = await signUp(conn, req.body)
      return res.json({ ...addNewUser, email: req.body.email, emailVerified: false, archivedAt: null, bannedAt: null })
    } catch (err: any) {
      if (err.message.includes('invalid-emial-key')) {
        return res.status(400).send({
          error: [
            {
              message: 'Email already registered in the system',
              location: 'body',
              slug: 'signup-email-already-exists',
            },
          ],
        })
      }
    }
  })
  return router
}
