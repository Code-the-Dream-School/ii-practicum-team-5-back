import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt, { SignOptions } from 'jsonwebtoken'

export interface IUser extends Document {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword?: string
  createJWT(): string
  comparePassword(userPassword: string): Promise<boolean>

  passwordResetToken?: string
  passwordResetExpires?: number
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, 'Please provide your first name.'],
      minlength: 1,
      maxlength: 50,
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, 'Please provide your last name.'],
      minlength: 1,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, 'Please provide email address.'],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
      ],
      lowercase: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide password.'],
      minlength: 8,
      validate: {
        validator: function (value: string) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(value)
        },
        message: 'Password must include at least one uppercase letter, one lowercase letter, and one number',
      },
    },
    confirmPassword: {
      type: String,
      validate: {
        validator: function (value: string) {
          return value === (this as IUser).password
        },
        message: 'Password does not match.',
      },
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Number,
    },
  },
  { timestamps: true }
)

// Pre save hook for password hashing and trimming fields
UserSchema.pre<IUser>('save', async function (next) {
  this.firstName = this.firstName.trim()
  this.lastName = this.lastName.trim()
  this.email = this.email.toLocaleLowerCase().trim()

  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
  }

  this.confirmPassword = undefined // remove confirmedPassword field
  next()
})

// create JWT token method
UserSchema.methods.createJWT = function (): string {
  const secretKey = process.env.JWT_SECRET_KEY as string // Explicit cast to string
  if (!secretKey) {
    throw new Error('JWT_SECRET_KEY is not defined in the environment variable.')
  }

  const expiresIn = process.env.JWT_LIFETIME ? parseInt(process.env.JWT_LIFETIME) : 3600 // Default to 1 hour (3600 seconds)
  const options: SignOptions = {
    expiresIn,
  }

  return jwt.sign({ userId: this._id, firstName: this.firstName, lastName: this.lastName }, secretKey, options)
}

// compare password method
UserSchema.methods.comparePassword = async function (userPassword: string): Promise<boolean> {
  console.log('Comparing:', userPassword, 'with hash:', this.password)
  return await bcrypt.compare(userPassword, this.password)
}

// define and export the User model
const User = mongoose.model<IUser>('User', UserSchema)

export default User
