import { Request, Response } from 'express'

const fetchAllPlans = (req: Request, res: Response) => {
  // TODO: Fetch all user's plans with pagination

  res.json({
    msg: 'DRAFT - fetch all plans',
  })
}

const createNewPlan = (req: Request, res: Response) => {
  // TODO: Create new plan and put in pending status as user gonna add some stops then hit publish.

  res.json({
    msg: 'DRAFT - create new plan',
  })
}

const fetchPlan = (req: Request, res: Response) => {
  // TODO: Fetch a plan with all stops if had any.

  res.json({
    msg: 'DRAFT - fetch a plan',
  })
}

const updatePlan = (req: Request, res: Response) => {
  // TODO: Update a plan's details.

  res.json({
    msg: 'DRAFT - update a plan',
  })
}

const ChangePlanStatus = (req: Request, res: Response) => {
  // TODO: Change a plan's status to published or pending.

  res.json({
    msg: 'DRAFT - change a plan status',
  })
}

const deletePlan = (req: Request, res: Response) => {
  // TODO: Delete a plan with all associated stops.

  res.json({
    msg: 'DRAFT - delete a plan',
  })
}

export { fetchAllPlans, createNewPlan, fetchPlan, updatePlan, ChangePlanStatus, deletePlan }
