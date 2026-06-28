import express from 'express'
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks,
} from '../controllers/taskController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// All task routes require authentication
router.use(protect)

router.get('/', getTasks)
router.post('/', createTask)
router.put('/reorder', reorderTasks)
router.put('/:id', updateTask)
router.delete('/:id', deleteTask)

export default router
