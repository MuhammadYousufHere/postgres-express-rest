import HttpException from './HTTPException'

class WrongCredentialsException extends HttpException {
  constructor() {
    super(401, 'Email or password does not match our records')
  }
}

export default WrongCredentialsException
