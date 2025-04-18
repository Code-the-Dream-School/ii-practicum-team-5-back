declare namespace Express {
  interface Request {
    user?: {
      userId: string
      name: string
      email: string
      token: string
    }
  }
}
