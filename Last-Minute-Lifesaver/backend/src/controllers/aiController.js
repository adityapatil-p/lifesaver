import {
  generateScheduleAI,
  prioritizeTasksAI,
  runRescueModeAI,
} from '../services/geminiService.js'
import Task from '../models/Task.js'

const taskOwnerQuery = (userId, extra = {}) => ({
  ...extra,
  $or: [{ user: userId }, { userId }],
})

// @desc    Generate optimized daily schedule & risks
// @route   POST /api/ai/schedule
// @access  Private
export const getSchedule = async (req, res) => {
  try {
    const tasks = await Task.find(taskOwnerQuery(req.user._id))
    const scheduleData = await generateScheduleAI(tasks)
    res.json({ success: true, ...scheduleData })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// @desc    Run AI Task Prioritization & update tasks
// @route   POST /api/ai/prioritize
// @access  Private
export const prioritizeTasks = async (req, res) => {
  try {
    const tasks = await Task.find(taskOwnerQuery(req.user._id, { status: { $ne: 'completed' } }))

    if (tasks.length === 0) {
      return res.json({ success: true, message: 'No active tasks to prioritize', taskUpdates: [] })
    }

    const aiPriorities = await prioritizeTasksAI(tasks)

    // Apply updates to the database
    const updates = []
    for (const item of aiPriorities) {
      const updateResult = await Task.updateOne(
        taskOwnerQuery(req.user._id, { _id: item.id }),
        { $set: { priority: item.priority } }
      )
      updates.push({
        id: item.id,
        priority: item.priority,
        reasoning: item.reasoning,
        updated: updateResult.modifiedCount > 0,
      })
    }

    res.json({ success: true, message: 'Tasks prioritized successfully', taskUpdates: updates })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// @desc    Trigger AI Rescue Mode
// @route   POST /api/ai/rescue
// @access  Private
export const triggerRescueMode = async (req, res) => {
  try {
    const tasks = await Task.find(taskOwnerQuery(req.user._id))
    const rescueData = await runRescueModeAI(tasks)

    // Option: Automatically defer tasks in the database to 'low' priority, or let the user decide.
    // The prompt says "deferredTasks: array of strings of task titles". We'll return it so the frontend can display it beautifully.

    res.json({ success: true, ...rescueData })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}
