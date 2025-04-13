import { Request, Response } from 'express'

const createNewStop = (req: Request, res: Response) => {
  // TODO: Create new stop for a plan.

  res.json({
    msg: 'DRAFT - create new stop',
  })
}

const fetchStop = (req: Request, res: Response) => {
  // TODO: Fetch a stop's details.

  res.json({
    msg: 'DRAFT - fetch a stop',
  })
}

const updateStop = (req: Request, res: Response) => {
  // TODO: Update a stop's details.

  res.json({
    msg: 'DRAFT - update a stop',
  })
}

const deleteStop = (req: Request, res: Response) => {
  // TODO: Delete a stop.

  res.json({
    msg: 'DRAFT - delete a stop',
  })
}

export { createNewStop, fetchStop, updateStop, deleteStop }
