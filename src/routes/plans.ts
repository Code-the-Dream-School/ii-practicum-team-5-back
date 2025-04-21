import express from 'express'
import { fetchAllPlans, fetchPlan, fetchUserWithPlans, fetchCategoryWithPlans } from '../controllers/plans'

const router = express.Router()

router.route('/').get(fetchAllPlans)
// Specific routes first
router.route('/user/:userId').get(fetchUserWithPlans)
router.route('/category/:categoryId').get(fetchCategoryWithPlans)
// Generic route last to avoid conflicts
router.route('/:planId').get(fetchPlan)

export default router
