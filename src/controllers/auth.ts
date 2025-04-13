import { Request, Response } from 'express'

const register = async (request: Request, res: Response) => {
  res.json({
    msg: 'DRAFT - register',
  })
}

const login = async (req: Request, res: Response) => {
  res.json({
    msg: 'DRAFT - login',
  })
}

export { register, login }
