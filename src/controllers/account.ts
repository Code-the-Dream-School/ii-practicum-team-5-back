import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import PlanSchema, { IPlan } from '../models/Plans'
import StopSchema, { IStop } from '../models/Stops'
import mongoose from 'mongoose'

const fetchAllPlans = async (req: Request, res: Response) => {
  if (!req.user) throw new Error('Not authorized to access.')

  const filters = {
    userId: req.user.userId,
  }

  // TODO: Add pagination support later

  const plans = await PlanSchema.find(filters).populate('categoryId', 'name').populate('userId', 'name')

  res.status(StatusCodes.OK).json({
    page: 1,
    size: 10,
    items: plans,
  })
}
// interface createNewPlanBodyType {
//   body: IPlan & {
//     stops: IStop[]
//   }
// }
const createNewPlan = async (req: Request, res: Response) => {
  if (!req.user) throw new Error('Not authorized to access.')

  const userId: string = req.user.userId
  let { stops, ...plan } = req.body

  const createdPlan: IPlan = await PlanSchema.create({
    ...plan,
    userId,
  })

  if (!createdPlan) throw new Error('Failed to create plan')

  if (stops.length) {
    stops = stops.map((stop: IStop) => ({
      ...stop,
      planId: createdPlan._id,
      userId: new mongoose.Types.ObjectId(userId),
    }))
  }

  const createdStops = await StopSchema.create(stops)

  res.status(StatusCodes.CREATED).json({ plan: createdPlan, stops: createdStops })
}

const fetchPlan = async (req: Request, res: Response) => {
  if (!req.user) throw new Error('Not authorized to access.')

  const userId = req.user.userId
  const planId = req.params.planId
  console.log('userId', userId)
  console.log('planId', planId)

  const plan: IPlan | null = await PlanSchema.findOne({
    userId,
    _id: planId,
  }).populate('categoryId', 'title')

  if (!plan) {
    throw new Error(`No plan with id ${planId}`)
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
  if (!req.user) throw new Error('Not authorized to access.')

  const userId: string = req.user.userId
  const planId = req.params.planId
  let { stops, ...plan } = req.body

  const updatedPlan: IPlan | null = await PlanSchema.findByIdAndUpdate(
    {
      _id: planId,
      userId,
    },
    plan,
    {
      new: true,
      runValidators: true,
    }
  )

  if (!updatedPlan) throw new Error('Failed to create plan')

  // TODO: Update multiple stops logic here

  res.status(StatusCodes.CREATED).json({ plan: updatedPlan, stops })
}

const deletePlan = async (req: Request, res: Response) => {
  if (!req.user) throw new Error('Not authorized to access.')

  const userId = req.user.userId
  const planId = req.params.planId

  const result = await PlanSchema.findByIdAndDelete({
    _id: planId,
    userId,
  })

  if (!result) {
    throw new Error(`No plan with id ${planId}`)
  }

  await StopSchema.deleteMany({
    planId,
  })

  res.status(StatusCodes.NO_CONTENT).end()
}

export { fetchAllPlans, createNewPlan, fetchPlan, updatePlan, deletePlan }
