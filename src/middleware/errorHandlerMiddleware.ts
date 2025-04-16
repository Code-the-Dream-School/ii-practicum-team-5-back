import { Request, Response, NextFunction } from 'express'
import CustomAPIError from '../errors/custom_error'
import { StatusCodes } from 'http-status-codes'

const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof CustomAPIError) {
    res.status(err.statusCode).json({ msg: err.message })
    return
  }

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    err: err.message || 'Internal Server Error',
  })
}

export default errorHandlerMiddleware
