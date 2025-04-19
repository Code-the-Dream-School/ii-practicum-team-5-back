import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import PlanSchema, { IPlan } from '../models/Plans'
import UserSchema, { IUser } from '../models/Users'
import StopSchema from '../models/Stops'
import CategorySchema, { ICategory } from '../models/Categories'
import NotFoundError from '../errors/not_found'

const PAGE_SIZE = 10

const fetchAllPlans = async (req: Request, res: Response) => {
  const { search, categoryId, page = 1, size = PAGE_SIZE } = req.query

  const filters = {
    ...(search && {
      title: { $regex: search, $options: 'i' },
    }),
    ...(categoryId && { categoryId }),
  }

  const pageSize: number = parseInt(size as string)
  const pageNumber: number = (parseInt(page as string) - 1) * pageSize

  const plans = await PlanSchema.find(filters)
    .populate('categoryId', 'name')
    .populate('userId', 'name')
    .skip(pageNumber)
    .limit(pageSize)

  res.status(StatusCodes.OK).json({
    ...{ search, categoryId },
    page: 1,
    size: 10,
    items: plans,
  })
}

const fetchUserWithPlans = async (req: Request, res: Response) => {
  const { userId } = req.params
  const { page = 1, size = PAGE_SIZE } = req.query

  const pageSize: number = parseInt(size as string)
  const pageNumber: number = (parseInt(page as string) - 1) * pageSize

  const user: IUser | null = await UserSchema.findById(userId)
    .orFail(new NotFoundError(`Item not found with the id: ${userId}`))
    .select('-password')
    .lean()

  const filters = {
    userId,
  }

  const plans = await PlanSchema.find(filters)
    .populate('categoryId', 'name')
    .populate('userId', 'name')
    .skip(pageNumber)
    .limit(pageSize)

  res.status(StatusCodes.OK).json({
    ...user,
    plans: {
      page: pageNumber,
      size: pageSize,
      items: plans,
    },
  })
}

const fetchCategoryWithPlans = async (req: Request, res: Response) => {
  const { categoryId } = req.params
  const { page = 1, size = PAGE_SIZE } = req.query

  const pageSize: number = parseInt(size as string)
  const pageNumber: number = (parseInt(page as string) - 1) * pageSize

  const category: ICategory | null = await CategorySchema.findById(categoryId)
    .orFail(new NotFoundError(`Item not found with the id: ${categoryId}`))
    .lean()

  const filters = {
    categoryId,
  }

  const plans = await PlanSchema.find(filters)
    .populate('categoryId', 'name')
    .populate('userId', 'name')
    .skip(pageNumber)
    .limit(pageSize)

  res.status(StatusCodes.OK).json({
    ...category,
    plans: {
      page: pageNumber,
      size: pageSize,
      items: plans,
    },
  })
}

const fetchPlan = async (req: Request, res: Response) => {
  const { planId } = req.params

  const plan: IPlan | null = await PlanSchema.findById(planId)
    .orFail(new NotFoundError(`Item not found with the id: ${planId}`))
    .populate('categoryId', 'name')
    .populate('userId', 'name')
    .lean()

  const stops = await StopSchema.find({ planId })

  res.status(StatusCodes.OK).json({
    ...plan,
    stops,
  })
}

export { fetchAllPlans, fetchPlan, fetchUserWithPlans, fetchCategoryWithPlans }
