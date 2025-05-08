import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import PlanSchema, { IPlan } from '../models/Plans'
import BookmarkSchema from '../models/Bookmarks'
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
    .lean()

  const authenticatedUserId = req.user ? req.user.userId : ''
  const plansWithBookmarksStatus = await attachBookmarkFlagToPlans(plans, authenticatedUserId)

  res.status(StatusCodes.OK).json({
    ...{ search, categoryId },
    page: 1,
    size: 10,
    items: plansWithBookmarksStatus,
  })
}

const fetchUserWithPlans = async (req: Request, res: Response) => {
  const { userId } = req.params
  const { page = 1, size = PAGE_SIZE } = req.query

  const pageSize: number = parseInt(size as string)
  const pageNumber: number = (parseInt(page as string) - 1) * pageSize

  const user: IUser | null = await UserSchema.findById(userId)
    .orFail(new NotFoundError(`Item not found with the id: ${userId}`))
    .select('name imageURL')
    .lean()

  const filters = {
    userId,
  }

  const plans = await PlanSchema.find(filters)
    .populate('categoryId', 'name')
    .populate('userId', 'name')
    .skip(pageNumber)
    .limit(pageSize)
    .lean()

  const authenticatedUserId = req.user ? req.user.userId : ''
  const plansWithBookmarksStatus = await attachBookmarkFlagToPlans(plans, authenticatedUserId)

  res.status(StatusCodes.OK).json({
    ...user,
    plans: {
      page: pageNumber,
      size: pageSize,
      items: plansWithBookmarksStatus,
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
    .lean()

  const authenticatedUserId = req.user ? req.user.userId : ''
  const plansWithBookmarksStatus = await attachBookmarkFlagToPlans(plans, authenticatedUserId)

  res.status(StatusCodes.OK).json({
    ...category,
    plans: {
      page: pageNumber,
      size: pageSize,
      items: plansWithBookmarksStatus,
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

  const loggedInUser = req.user || null
  let isBookmarked: boolean = false
  if (loggedInUser) {
    const res = await BookmarkSchema.exists({
      userId: loggedInUser.userId,
      planId,
    }).lean()
    if (res) {
      isBookmarked = true
    }
  }

  res.status(StatusCodes.OK).json({
    ...plan,
    isBookmarked,
    stops,
  })
}

const fetchAllCategories = async (req: Request, res: Response) => {
  const categories = await CategorySchema.find().lean()
  res.status(StatusCodes.OK).json(categories)
}

const attachBookmarkFlagToPlans = async (plans: IPlan[], userId: string) => {
  if (!userId)
    return plans.map((plan) => ({
      ...plan,
      isBookmarked: false,
    }))

  // Extract only plan IDs
  const planIds = plans.map((plan) => plan._id)

  // Get plan IDs from bookmarks collection based on userId
  const bookmarks = await BookmarkSchema.find({
    userId,
    planId: { $in: planIds },
  }).select('planId')

  // Create a Set for fast lookup
  const bookmarkedPlanIds = new Set(bookmarks.map((b) => b.planId.toString()))

  // Attach isBookmarked state to each plan
  return plans.map((plan) => ({
    ...plan,
    isBookmarked: bookmarkedPlanIds.has(plan._id.toString()),
  }))
}

export { fetchAllPlans, fetchPlan, fetchUserWithPlans, fetchCategoryWithPlans, fetchAllCategories }
