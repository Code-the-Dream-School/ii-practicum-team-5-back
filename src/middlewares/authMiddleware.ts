import { Request, Response, NextFunction } from 'express'

const authMiddleware = async (request: Request, response: Response, next: NextFunction) => {
  // TODO: Authentication logic here

  next()
}

export default authMiddleware
