import Task from '../models/Task.js'
import { prioritizeTasksAI } from '../services/geminiService.js'

// @desc    Get user tasks
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
  try {
    // Sort primarily by deadline ascending (closest deadlines first), then priority
    const tasks = await Task.find({ userId: req.user._id }).sort({ order: 1, deadline: 1 })
    res.json({ success: true, tasks })
  } catch (error) {
    console.error('Get Tasks Error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private

export const createTask = async (req, res) => {

  console.log("REQ BODY:", req.body);

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
    const task = await Task.create({
      userId: req.user._id,
      title,
      description,
      priority: priority || 'medium',
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
        const allUserTasks = await Task.find({ userId: req.user._id, status: { $ne: 'done' } })
        if (allUserTasks.length > 0) {
          const aiPriorities = await prioritizeTasksAI(allUserTasks)
          for (const item of aiPriorities) {
            await Task.updateOne(
              { _id: item.id, userId: req.user._id },
              { $set: { priority: item.priority } }
            )
          }
        }
      } catch (aiErr) {
        console.error('Failed to auto-prioritize task via AI:', aiErr.message)
      }
    }

    // Refetch the created task to make sure we return the updated priority if AI changed it
    const updatedTask = await Task.findById(task._id)

    res.status(201).json({ success: true, task: updatedTask })
  } catch (error) {
    console.error('Create Task Error:', error)
    res.status(400).json({ success: false, error: error.message })
  }
}

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  const { id } = req.params

  try {
    const task = await Task.findOne({ _id: id, userId: req.user._id })

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found or unauthorized' })
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
        task[field] = req.body[field]
      }
    })

    const updatedTask = await task.save()
    res.json({ success: true, task: updatedTask })
  } catch (error) {
    console.error('Update Task Error:', error)
    res.status(400).json({ success: false, error: error.message })
  }
}

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
  const { id } = req.params

  try {
    const result = await Task.deleteOne({ _id: id, userId: req.user._id })

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: 'Task not found or unauthorized' })
    }

    res.json({ success: true, message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Delete Task Error:', error)
    res.status(500).json({ success: false, error: error.message })
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
        {
          _id: taskIds[i],
          userId: req.user._id,
        },
        {
          order: i,
        }
      );

    }

    res.json({
      success: true,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });

  }
};