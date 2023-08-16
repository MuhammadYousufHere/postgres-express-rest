import HttpException from './HTTPException'

class WrongAuthenticationTokenException extends HttpException {
  constructor() {
    super(401, 'Token invalid or expired')
  }
}

export default WrongAuthenticationTokenException
