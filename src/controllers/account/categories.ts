import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import CategorySchema, { ICategory } from '../../models/Categories'
import CustomAPIError from '../../errors/custom_error'
import UnauthenticatedError from '../../errors/unauthentication_error'

const fetchAllCategories = async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthenticatedError('Not authorized to access.')

  const categories = await CategorySchema.find()

  res.status(StatusCodes.OK).json(categories)
}

const createNewCategory = async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthenticatedError('Not authorized to access.')

  const userId: string = req.user.userId

  const createdCategory: ICategory = await CategorySchema.create({
    ...req.body,
    userId,
  })

  if (!createdCategory) throw new CustomAPIError('Failed to create category', StatusCodes.INTERNAL_SERVER_ERROR)

  res.status(StatusCodes.CREATED).json(createdCategory)
}

export { fetchAllCategories, createNewCategory }
