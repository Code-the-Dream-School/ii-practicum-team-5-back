import { Request, Response, NextFunction } from 'express'
import CustomAPIError from '../errors/custom_error'
import { StatusCodes } from 'http-status-codes'


const errorHandlerMiddleware = (
  err: any, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
    err: err.message || 'Internal Server Error' 
  });
}

export default errorHandlerMiddleware;
