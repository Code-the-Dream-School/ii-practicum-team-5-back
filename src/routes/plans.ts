import express from 'express'
import { fetchAllPlans, fetchPlan, fetchUserWithPlans, fetchCategoryWithPlans } from '../controllers/plans'

const router = express.Router()

router.route('/').get(fetchAllPlans)
router.route('/plan/:planId').get(fetchPlan)
router.route('/user/:userId').get(fetchUserWithPlans)
router.route('/category/:categoryId').get(fetchCategoryWithPlans)

export default router
