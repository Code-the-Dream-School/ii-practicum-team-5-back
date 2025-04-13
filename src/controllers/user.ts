import crypto from 'crypto'
import { StatusCodes } from 'http-status-codes'
import { NextFunction, Request, Response } from 'express'
import BadRequestError from '../errors/bad_request'
import UnauthenticatedError from '../errors/unauthentication_error'
import NotFoundError from '../errors/not_found'
import sendEmail from '../utils/email'
import User from '../model/user'

interface RegisterRequestBody {
  firstName: string
  lastName: string
  email: string
  password: string
}

const register = async (req: Request<object, object, RegisterRequestBody>, res: Response): Promise<void> => {
  const { firstName, lastName, email, password } = req.body
  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      res.status(400).json({ error: 'User already exists' })
      return
    }
    const user = new User({
      firstName,
      lastName,
      email,
      password,
    })
    await user.save()
    res.status(StatusCodes.CREATED).json({
      user: { id: user._id, name: `${user.firstName} ${user.lastName}` },
      msg: 'User registered successfully',
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error registering user.' })
  }
}

const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body.email ? req.body : req.query
    console.log('email: ', email)
    if (!email || !password) {
      throw new BadRequestError('Please provide email and password')
    }
    const user = await User.findOne({ email: email.toLocaleLowerCase() })
    console.log('Found user:', user)
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
      user: { id: user._id, name: `${user.firstName} ${user.lastName}` },
      token,
    })
  } catch (error) {
    next(error)
  }
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
  try {
    await User.updateOne(
      { _id: user._id },
      {
        passwordResetToken: resetToken,
        passwordResetExpires: Date.now() + 3600000,
      }
    )
    console.log('Password reset token and expiration updated successfully')
  } catch (error) {
    console.error('Error updating password reset info:', error)
  }
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
    res.status(StatusCodes.OK).json({ msg: 'Password reset email sent' })
  } catch (error) {
    console.error('Error details:', error)
    throw new BadRequestError('Error sending password reset email')
  }
}

const resetPassword = async (req: Request, res: Response) => {
  const { resetToken, newPassword } = req.body.resetToken ? req.body : req.query
  if (!resetToken || !newPassword) {
    throw new BadRequestError('Please provide a valid token and new password.')
  }
  const user = await User.findOne({
    passwordResetToken: resetToken,
    passwordResetExpires: { $gt: Date.now() },
  })
  if (!user) {
    throw new NotFoundError('Invalid or expired password reset token.')
  }
  console.log('User found, resetting password...')

  user.password = newPassword
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined

  try {
    await user.save()
    res.status(StatusCodes.OK).json({
      newPassword: newPassword,
      msg: 'Password reset successfully.',
    })
  } catch (error) {
    console.error('Error saving user after password reset:', error)
    throw new BadRequestError('Error saving new password')
  }
}

export { register, login, requestPasswordReset, resetPassword }
