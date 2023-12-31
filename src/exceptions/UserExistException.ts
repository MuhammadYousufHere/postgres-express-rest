import HttpException from './HTTPException'

class UserExistsException extends HttpException {
  constructor(email: string) {
    super(400, `User with email ${email} already exists`)
  }
}

export default UserExistsException
