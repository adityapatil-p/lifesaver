import express from 'express'
import {
  getSummary,
  getDetails,
} from '../controllers/analyticsController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.use(protect)

router.get('/summary', getSummary)
router.get('/details', getDetails)

export default router
