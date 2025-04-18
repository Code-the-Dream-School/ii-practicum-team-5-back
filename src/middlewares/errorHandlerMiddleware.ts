import { Request, Response, NextFunction } from 'express'

const errorHandlerMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  // TODO: Error handling logic here

  next(err)
}

export default errorHandlerMiddleware
