import crypto from 'crypto'
import { StatusCodes } from 'http-status-codes'
import { Request, Response } from 'express'
import BadRequestError from '../errors/bad_request'
import UnauthenticatedError from '../errors/unauthentication_error'
import CustomAPIError from '../errors/custom_error'
import NotFoundError from '../errors/not_found'
import sendEmail from '../utils/email'
import User from '../models/Users'

interface RegisterRequestBody {
  name: string
  email: string
  password: string
}

const register = async (req: Request<object, object, RegisterRequestBody>, res: Response): Promise<void> => {
  const { name, email, password } = req.body

  const user = new User({
    name,
    email,
    password,
    imageURL: `https://api.dicebear.com/7.x/micah/png?seed=${email}&flip=true&w=96&q=75`,
  })
  await user.save()

  const token = user.createJWT()

  res.status(StatusCodes.CREATED).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    imageURL: user.imageURL,
    token,
  })
}

const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body.email ? req.body : req.query

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }

  const user = await User.findOne({ email: email.toLocaleLowerCase() })
  if (!user) {
    throw new UnauthenticatedError("Can't find this user.")
  }

  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('password is incorrect.')
  }

  // generate JWT token and response.
  const token = user.createJWT()
  const expiresIn = process.env.JWT_EXPIRES_IN || 3000
  res.cookie('token', token, {
    maxAge: parseInt(`${expiresIn}`) * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV == 'production',
    sameSite: 'strict',
  })
  res.status(StatusCodes.OK).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    imageURL: user.imageURL,
    token,
  })
}

const requestPasswordReset = async (req: Request, res: Response) => {
  const { email } = req.body.email ? req.body : req.query
  console.log('Email received:', email)
  if (!email) {
    throw new BadRequestError('Please provide an email address.')
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new NotFoundError("User with this email doesn't exist.")
  }
  // generate a reset token
  const resetToken = crypto.randomBytes(20).toString('hex')
  // set reset token and expiration date
  user.passwordResetToken = resetToken
  user.passwordResetExpires = Date.now() + 3600000 // 1 hour

  await User.updateOne(
    { _id: user._id },
    {
      passwordResetToken: resetToken,
      passwordResetExpires: Date.now() + 3600000,
    }
  )
  console.log('Password reset token and expiration updated successfully')

  // send email with reset token
  const isProduction = process.env.NODE_ENV === 'production'
  console.log(`Running in ${process.env.NODE_ENV} mode `)
  const resetUrl = isProduction
    ? 'https://production-domain.com/resetPassword/'
    : 'http://localhost:5173/resetpassword/'
  const message = `Click the following link to reset your password: ${resetUrl}${resetToken}`
  try {
    await sendEmail({
      to: email,
      subject: 'Password Reset Request',
      message,
    })
    console.log('Email sent successfully.')
    res.status(StatusCodes.NO_CONTENT).end()
  } catch (error) {
    console.error('Error details:', error)
    throw new CustomAPIError('Error sending password reset email', StatusCodes.INTERNAL_SERVER_ERROR)
  }
}

const resetPassword = async (req: Request, res: Response) => {
  const { resetToken, newPassword } = req.body
  if (!resetToken || !newPassword) {
    throw new BadRequestError('Please provide a valid token and new password.')
  }
  const user = await User.findOne({
    passwordResetToken: resetToken,
    passwordResetExpires: { $gt: Date.now() },
  })
  if (!user) {
    throw new UnauthenticatedError('Invalid or expired password reset token.')
  }
  console.log('User found, resetting password...')

  user.password = newPassword
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined

  await user.save()
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    imageURL: user.imageURL,
    token,
  })
}

export { register, login, requestPasswordReset, resetPassword }
