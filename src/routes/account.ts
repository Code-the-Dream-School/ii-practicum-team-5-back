import express from 'express'
import {
  fetchAllPlans,
  createNewPlan,
  fetchPlan,
  updatePlan,
  ChangePlanStatus,
  deletePlan,
} from '../controllers/account'
import { createNewStop, fetchStop, updateStop, deleteStop } from '../controllers/stops'

const router = express.Router()

router.route('/').get(fetchAllPlans).post(createNewPlan)
router.route('/:planId').get(fetchPlan).put(updatePlan).patch(ChangePlanStatus).delete(deletePlan)
// TODO: Add POST /:planId/stops endpoint to the swagger.yaml file.
router.route('/:planId/stops').post(createNewStop)
router.route('/:planId/stops/:stopId').get(fetchStop).put(updateStop).delete(deleteStop)

export default router
