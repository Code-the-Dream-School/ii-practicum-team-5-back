import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import UnauthenticatedError from '../errors/unauthentication_error'

interface MyJwtPayload extends jwt.JwtPayload {
  userId: string
  firstName: string
  lastName: string
}

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string
    name: string
  }
}

const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  console.log('authHeader ', authHeader)

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Authentication invalid')
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as MyJwtPayload
    console.log('JWT Payload:', payload)

    res.locals.user = {
      userId: payload.userId,
      name: `${payload.firstName} ${payload.lastName}`,
    }

    console.log(`Middleware check user`, req.user)
    next()
  } catch (error) {
    console.error(error)
    throw new UnauthenticatedError('Authentication invalid')
  }
}

export default authMiddleware
