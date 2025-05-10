import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import PlanSchema, { IPlan } from '../../models/Plans'
import StopSchema, { IStop } from '../../models/Stops'
import mongoose from 'mongoose'
import CustomAPIError from '../../errors/custom_error'
import NotFoundError from '../../errors/not_found'
import UnauthenticatedError from '../../errors/unauthentication_error'

const PAGE_SIZE = 10

const fetchAllPlans = async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthenticatedError('Not authorized to access.')

  const { page = '1', size = PAGE_SIZE } = req.query

  const filters = {
    userId: req.user.userId,
  }

  const pageSize: number = parseInt(size as string)
  const pageNumber: number = (parseInt(page as string) - 1) * pageSize

  const totalItems = await PlanSchema.countDocuments(filters)
  const pagesCount = Math.ceil(totalItems / pageSize)

  const plans = await PlanSchema.find(filters)
    .populate('categoryId', 'name')
    .populate('userId', 'name')
    .skip(pageNumber)
    .limit(pageSize)

  res.status(StatusCodes.OK).json({
    page: parseInt(page as string),
    size: pageSize,
    pagesCount,
    items: plans,
  })
}

const createNewPlan = async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthenticatedError('Not authorized to access.')

  const userId: string = req.user.userId
  let { stops, ...plan } = req.body

  const createdPlan: IPlan = await PlanSchema.create({
    ...plan,
    stopCount: stops.length,
    userId,
  })

  if (!createdPlan) throw new CustomAPIError('Failed to create plan', StatusCodes.INTERNAL_SERVER_ERROR)

  await createdPlan.populate('categoryId', 'name')
  await createdPlan.populate('userId', 'name')

  if (stops.length) {
    stops = stops.map((stop: IStop, index: number) => ({
      ...stop,
      sequence: index,
      planId: createdPlan._id,
      userId: new mongoose.Types.ObjectId(userId),
    }))
  }

  const createdStops = await StopSchema.create(stops)

  res.status(StatusCodes.CREATED).json({ plan: createdPlan, stops: createdStops })
}

const fetchPlan = async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthenticatedError('Not authorized to access.')

  const userId = req.user.userId
  const planId = req.params.planId
  console.log('userId', userId)
  console.log('planId', planId)

  const plan: IPlan | null = await PlanSchema.findOne({
    userId,
    _id: planId,
  })
    .populate('categoryId', 'name')
    .populate('userId', 'name')

  if (!plan) {
    throw new NotFoundError(`No plan with id ${planId}`)
  }

  const stops = await StopSchema.find({
    planId,
  })

  res.status(StatusCodes.OK).json({
    ...plan.toJSON(),
    stops,
  })
}

const updatePlan = async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthenticatedError('Not authorized to access.')

  const userId: string = req.user.userId
  const planId = req.params.planId

  let { stops, ...plan } = req.body

  const updatedPlan: IPlan | null = await PlanSchema.findByIdAndUpdate(
    {
      _id: planId,
      userId,
    },
    {
      ...plan,
      stopCount: stops.length,
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate('categoryId', 'name')
    .populate('userId', 'name')

  if (!updatedPlan) throw new CustomAPIError('Failed to update the plan', StatusCodes.INTERNAL_SERVER_ERROR)

  const operations = stops.map(async (stop: IStop, index: number) => {
    // Update stops that have ID
    if (stop._id) {
      const updatedStop = await StopSchema.findByIdAndUpdate(
        stop._id,
        {
          ...stop,
          sequence: index,
        },
        {
          new: true,
          runValidators: true,
        }
      )
      if (updatedStop) return updatedStop._id.toString()
    } else {
      // Create stops that don't have ID
      const createdStop = await StopSchema.create({
        ...stop,
        sequence: index,
        planId,
        userId: new mongoose.Types.ObjectId(userId),
      })
      if (createdStop) return createdStop._id.toString()
    }
  })
  const stopIDs = await Promise.all(operations)

  // Delete stops that its ID doesn't exist on passed array of stops
  const currentStops = await StopSchema.find({
    planId,
  })
  const idsToDelete = currentStops.filter((stop) => !stopIDs.includes(stop._id.toString())).map((stop) => stop._id)
  if (idsToDelete.length > 0) {
    await StopSchema.deleteMany({ _id: { $in: idsToDelete } })
  }

  const planStops = await StopSchema.find({
    planId,
  })

  res.status(StatusCodes.CREATED).json({ plan: updatedPlan, stops: planStops })
}

const deletePlan = async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthenticatedError('Not authorized to access.')

  const userId = req.user.userId
  const planId = req.params.planId

  const result = await PlanSchema.findByIdAndDelete({
    _id: planId,
    userId,
  })

  if (!result) {
    throw new NotFoundError(`No plan with id ${planId}`)
  }

  await StopSchema.deleteMany({
    planId,
  })

  res.status(StatusCodes.NO_CONTENT).end()
}

export { fetchAllPlans, createNewPlan, fetchPlan, updatePlan, deletePlan }
