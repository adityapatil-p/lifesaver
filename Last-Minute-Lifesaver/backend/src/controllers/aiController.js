import {
  generateScheduleAI,
  prioritizeTasksAI,
  runRescueModeAI,
} from '../services/geminiService.js'
import Task from '../models/Task.js'

// @desc    Generate optimized daily schedule & risks
// @route   POST /api/ai/schedule
// @access  Private
export const getSchedule = async (req, res) => {
  try {
    console.log('Schedule Controller Started')
    const tasks = await Task.find({ userId: req.user._id })
    console.log('Tasks:', tasks.length)
    const scheduleData = await generateScheduleAI(tasks)
    console.log('Schedule Generated')
    res.json({ success: true, ...scheduleData })
  } catch (error) {
    console.error('AI Schedule Error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}

// @desc    Run AI Task Prioritization & update tasks
// @route   POST /api/ai/prioritize
// @access  Private
export const prioritizeTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id, status: { $ne: 'done' } })

    if (tasks.length === 0) {
      return res.json({ success: true, message: 'No active tasks to prioritize', taskUpdates: [] })
    }

    const aiPriorities = await prioritizeTasksAI(tasks)

    // Apply updates to the database
    const updates = []
    for (const item of aiPriorities) {
      const updateResult = await Task.updateOne(
        { _id: item.id, userId: req.user._id },
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
    console.error('AI Prioritize Error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}

// @desc    Trigger AI Rescue Mode
// @route   POST /api/ai/rescue
// @access  Private
export const triggerRescueMode = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id })
    const rescueData = await runRescueModeAI(tasks)

    // Log tasks that were recommended for deferral
    console.log(`Rescue mode run. User ${req.user._id}. Deferred:`, rescueData.deferredTasks)

    // Option: Automatically defer tasks in the database to 'low' priority, or let the user decide.
    // The prompt says "deferredTasks: array of strings of task titles". We'll return it so the frontend can display it beautifully.

    res.json({ success: true, ...rescueData })
  } catch (error) {
    console.error('AI Rescue Mode Error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}
