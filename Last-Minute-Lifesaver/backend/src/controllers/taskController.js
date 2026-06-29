import Task from '../models/Task.js'
import { prioritizeTasksAI } from '../services/geminiService.js'

const taskOwnerQuery = (userId, extra = {}) => ({
  ...extra,
  $or: [{ user: userId }, { userId }],
})

const normalizeStatus = (status) => (status === 'done' ? 'completed' : status)

const allowedPriorities = ['low', 'medium', 'high', 'critical']
const allowedStatuses = ['todo', 'in-progress', 'completed']

const sendTaskError = (res, error, fallbackStatus = 400) => {
  if (error.name === 'CastError') {
    return res.status(404).json({ success: false, error: 'Task not found' })
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ success: false, error: error.message })
  }

  return res.status(fallbackStatus).json({ success: false, error: error.message })
}

// @desc    Get user tasks
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
  try {
    // Sort primarily by deadline ascending (closest deadlines first), then priority
    const tasks = await Task.find(taskOwnerQuery(req.user._id)).sort({ order: 1, deadline: 1 })
    res.json({ success: true, tasks })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// @desc    Get one user task
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne(taskOwnerQuery(req.user._id, { _id: req.params.id }))

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' })
    }

    res.json({ success: true, task })
  } catch (error) {
    sendTaskError(res, error)
  }
}

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private

export const createTask = async (req, res) => {
  const {
    title,
    description,
    priority,
    deadline,
    category,
    tags,
    progress,
    assignee,
  } = req.body;

  try {
    if (!title?.trim()) {
      return res.status(400).json({ success: false, error: 'Task title is required' })
    }

    if (!deadline) {
      return res.status(400).json({ success: false, error: 'Task deadline is required' })
    }

    if (priority && !allowedPriorities.includes(priority)) {
      return res.status(400).json({ success: false, error: 'Invalid task priority' })
    }

    const task = await Task.create({
      user: req.user._id,
      userId: req.user._id,
      title: title.trim(),
      description,
      priority: priority || 'medium',
      status: normalizeStatus(req.body.status) || 'todo',
      deadline,
      category: category || 'General',
      tags: tags || [],
      progress: progress || 0,
      assignee: assignee || req.user.name,
    })

    // If smartPrioritize is enabled, we could evaluate priorities using Gemini
    if (req.user.preferences?.aiSettings?.smartPrioritize) {
      try {
        // Run AI prioritization in the background (or block, let's keep it async so creation is fast)
        const allUserTasks = await Task.find(taskOwnerQuery(req.user._id, { status: { $ne: 'completed' } }))
        if (allUserTasks.length > 0) {
          const aiPriorities = await prioritizeTasksAI(allUserTasks)
          for (const item of aiPriorities) {
            await Task.updateOne(
              taskOwnerQuery(req.user._id, { _id: item.id }),
              { $set: { priority: item.priority } }
            )
          }
        }
      } catch (aiErr) {
      }
    }

    // Refetch the created task to make sure we return the updated priority if AI changed it
    const updatedTask = await Task.findById(task._id)

    res.status(201).json({ success: true, task: updatedTask })
  } catch (error) {
    sendTaskError(res, error)
  }
}

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  const { id } = req.params

  try {
    const task = await Task.findOne(taskOwnerQuery(req.user._id, { _id: id }))

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' })
    }

    if (req.body.priority && !allowedPriorities.includes(req.body.priority)) {
      return res.status(400).json({ success: false, error: 'Invalid task priority' })
    }

    if (req.body.status && !allowedStatuses.includes(normalizeStatus(req.body.status))) {
      return res.status(400).json({ success: false, error: 'Invalid task status' })
    }

    // Update fields
    const fieldsToUpdate = [
      'title',
      'description',
      'priority',
      'status',
      'deadline',
      'category',
      'tags',
      'progress',
      'assignee',
    ]

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        task[field] = field === 'status' ? normalizeStatus(req.body[field]) : req.body[field]
      }
    })

    const updatedTask = await task.save()
    res.json({ success: true, task: updatedTask })
  } catch (error) {
    sendTaskError(res, error)
  }
}

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
  const { id } = req.params

  try {
    const result = await Task.deleteOne(taskOwnerQuery(req.user._id, { _id: id }))

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: 'Task not found' })
    }

    res.json({ success: true, message: 'Task deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// @desc    Mark a task complete
// @route   PATCH /api/tasks/:id/complete
// @access  Private
export const completeTask = async (req, res) => {
  try {
    const task = await Task.findOne(taskOwnerQuery(req.user._id, { _id: req.params.id }))

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' })
    }

    task.status = 'completed'
    task.completedAt = task.completedAt || new Date()
    task.progress = 100

    const updatedTask = await task.save()
    res.json({ success: true, task: updatedTask })
  } catch (error) {
    sendTaskError(res, error)
  }
}

// @desc    Update a task status
// @route   PATCH /api/tasks/:id/status
// @access  Private
export const updateTaskStatus = async (req, res) => {
  const status = normalizeStatus(req.body.status)

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ success: false, error: 'Invalid task status' })
  }

  try {
    const task = await Task.findOne(taskOwnerQuery(req.user._id, { _id: req.params.id }))

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' })
    }

    task.status = status
    const updatedTask = await task.save()

    res.json({ success: true, task: updatedTask })
  } catch (error) {
    sendTaskError(res, error)
  }
}

// @desc    Update a task priority
// @route   PATCH /api/tasks/:id/priority
// @access  Private
export const updateTaskPriority = async (req, res) => {
  const { priority } = req.body

  if (!allowedPriorities.includes(priority)) {
    return res.status(400).json({ success: false, error: 'Invalid task priority' })
  }

  try {
    const task = await Task.findOne(taskOwnerQuery(req.user._id, { _id: req.params.id }))

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' })
    }

    task.priority = priority
    const updatedTask = await task.save()

    res.json({ success: true, task: updatedTask })
  } catch (error) {
    sendTaskError(res, error)
  }
}

// @desc    Bulk reorder tasks
// @route   PUT /api/tasks/reorder
// @access  Private
export const reorderTasks = async (req, res) => {
  const { taskIds } = req.body;

  try {

    if (!Array.isArray(taskIds)) {
      return res.status(400).json({
        success: false,
        error: "taskIds array is required",
      });
    }

    for (let i = 0; i < taskIds.length; i++) {

      await Task.updateOne(
        taskOwnerQuery(req.user._id, { _id: taskIds[i] }),
        {
          order: i,
        }
      );

    }

    res.json({
      success: true,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });

  }
};
