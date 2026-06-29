import express from 'express'
import {
  completeTask,
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskPriority,
  updateTaskStatus,
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
router.get('/:id', getTaskById)
router.patch('/:id/complete', completeTask)
router.patch('/:id/status', updateTaskStatus)
router.patch('/:id/priority', updateTaskPriority)
router.put('/:id', updateTask)
router.delete('/:id', deleteTask)

export default router
