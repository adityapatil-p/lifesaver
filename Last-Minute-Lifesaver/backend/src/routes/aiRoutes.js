import express from 'express'
import {
  getSchedule,
  prioritizeTasks,
  triggerRescueMode,
} from '../controllers/aiController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.use(protect)

router.post('/schedule', getSchedule)
router.post('/prioritize', prioritizeTasks)
router.post('/rescue', triggerRescueMode)

export default router
