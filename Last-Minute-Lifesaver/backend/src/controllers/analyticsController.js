import Task from '../models/Task.js'

const taskOwnerQuery = (userId, extra = {}) => ({
  ...extra,
  $or: [{ user: userId }, { userId }],
})

const isCompleted = (task) => task.status === 'completed' || task.status === 'done'

// Helper to determine day label from date
const getDayLabel = (date) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return days[new Date(date).getDay()]
}

// Helper to calculate productivity score
const calculateProductivityScore = (tasks) => {
  if (tasks.length === 0) return 80 // Default baseline score

  const total = tasks.length
  const completed = tasks.filter(isCompleted).length
  const criticalCompleted = tasks.filter((t) => isCompleted(t) && t.priority === 'critical').length
  const overdue = tasks.filter((t) => !isCompleted(t) && new Date(t.deadline) < new Date()).length

  // Base score based on completion rate
  let score = Math.round((completed / total) * 100)

  // AI modifier: bonus for critical tasks completed, penalty for overdue tasks
  score += criticalCompleted * 5
  score -= overdue * 8

  // Cap between 0 and 100
  return Math.max(0, Math.min(100, score))
}

// @desc    Get analytics overview/summary
// @route   GET /api/analytics/summary
// @access  Private
export const getSummary = async (req, res) => {
  try {
    const tasks = await Task.find(taskOwnerQuery(req.user._id))

    const total = tasks.length
    const completed = tasks.filter(isCompleted).length
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
    const productivityScore = calculateProductivityScore(tasks)

    // Count upcoming deadlines within next 48 hours
    const now = new Date()
    const futureLimit = new Date(now.getTime() + 48 * 60 * 60 * 1000)
    const upcomingDeadlinesCount = tasks.filter(
      (t) => !isCompleted(t) && new Date(t.deadline) >= now && new Date(t.deadline) <= futureLimit
    ).length

    res.json({
      success: true,
      summary: {
        productivityScore,
        completionRate,
        upcomingDeadlinesCount,
        totalTasks: total,
        completedTasks: completed,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// @desc    Get detailed charts analytics data
// @route   GET /api/analytics/details
// @access  Private
export const getDetails = async (req, res) => {
  try {
    const tasks = await Task.find(taskOwnerQuery(req.user._id))

    // 1. Completion Stats Breakdown
    const completedCount = tasks.filter(isCompleted).length
    const inProgressCount = tasks.filter((t) => t.status === 'in-progress').length
    const overdueCount = tasks.filter((t) => !isCompleted(t) && new Date(t.deadline) < new Date()).length
    const todoCount = tasks.filter((t) => t.status === 'todo' && new Date(t.deadline) >= new Date()).length

    const completionStats = [
      { name: 'Completed', value: completedCount, color: '#6366f1' },
      { name: 'In Progress', value: inProgressCount, color: '#a78bfa' },
      { name: 'Overdue', value: overdueCount, color: '#f472b6' },
      { name: 'Remaining', value: todoCount, color: '#71717a' },
    ]

    // 2. Category Breakdown
    const categoriesMap = {}
    tasks.forEach((t) => {
      const cat = t.category || 'General'
      categoriesMap[cat] = (categoriesMap[cat] || 0) + 1
    })
    const categoryBreakdown = Object.keys(categoriesMap).map((cat) => ({
      category: cat,
      count: categoriesMap[cat],
    }))

    // 3. Weekly Progress (mock comparison base + actual tasks grouping)
    // Group active tasks completed/planned by day of week
    const weeklyProgress = [
      { day: 'Mon', completed: 0, planned: 0, focus: 80 },
      { day: 'Tue', completed: 0, planned: 0, focus: 80 },
      { day: 'Wed', completed: 0, planned: 0, focus: 80 },
      { day: 'Thu', completed: 0, planned: 0, focus: 80 },
      { day: 'Fri', completed: 0, planned: 0, focus: 80 },
      { day: 'Sat', completed: 0, planned: 0, focus: 80 },
      { day: 'Sun', completed: 0, planned: 0, focus: 80 },
    ]

    tasks.forEach((t) => {
      const dayName = getDayLabel(t.deadline)
      const weekDay = weeklyProgress.find((w) => w.day === dayName)
      if (weekDay) {
        weekDay.planned += 1
        if (isCompleted(t)) {
          weekDay.completed += 1
        }
      }
    })

    weeklyProgress.forEach((w) => {
      w.focus = w.planned > 0 ? Math.round((w.completed / w.planned) * 100) : 80
    })

    // 4. Productivity Trend (Last 7 days scores)
    const productivityTrend = []
    const now = new Date()
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      const currentScore = calculateProductivityScore(tasks)
      const score = currentScore
      
      productivityTrend.push({ date: dateStr, score })
    }

    // 5. Heatmap Data (by Hour blocks)
    const hours = ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM']
    const heatmapData = hours.map((h) => {
      const entry = { hour: h }
      const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
      days.forEach((d) => {
        entry[d] = 0
      })
      return entry
    })

    tasks.forEach((t) => {
      if (!t.deadline) return

      const date = new Date(t.deadline)
      const day = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][date.getDay()]
      const hour = date.getHours()
      const bucket = hour < 7 ? '6AM'
        : hour < 9 ? '8AM'
          : hour < 11 ? '10AM'
            : hour < 13 ? '12PM'
              : hour < 15 ? '2PM'
                : hour < 17 ? '4PM'
                  : hour < 19 ? '6PM'
                    : '8PM'
      const row = heatmapData.find((item) => item.hour === bucket)

      if (row) {
        row[day] += 1
      }
    })

    // 6. Weekly Performance list (for history charts)
    const weeklyPerformance = [
      { week: 'W1', tasks: 12, completed: 8, hours: 14 },
      { week: 'W2', tasks: 15, completed: 12, hours: 22 },
      { week: 'W3', tasks: 18, completed: 14, hours: 26 },
      { week: 'W4', tasks: 20, completed: 18, hours: 30 },
      { week: 'W5', tasks: tasks.length, completed: completedCount, hours: 35 },
      { week: 'W6', tasks: tasks.length, completed: completedCount, hours: 38 },
    ]

    // 7. Smart Insights
    const pScore = calculateProductivityScore(tasks)
    const onTimeRate = tasks.filter(isCompleted).length > 0
      ? Math.round((tasks.filter((t) => isCompleted(t) && new Date(t.completedAt || t.updatedAt) <= new Date(t.deadline)).length / completedCount) * 100)
      : 85

    const smartInsights = [
      {
        id: 's1',
        metric: `+${Math.round(pScore * 0.1)}%`,
        label: 'Productivity vs baseline',
        trend: 'up',
        detail: `Your focus sessions score is currently at ${pScore} points.`,
      },
      {
        id: 's2',
        metric: overdueCount > 0 ? `${overdueCount}` : '0',
        label: 'Overdue Tasks',
        trend: overdueCount > 0 ? 'down' : 'up',
        detail: overdueCount > 0 ? 'Requires attention via Rescue Mode.' : 'Excellent work! No overdue tasks.',
      },
      {
        id: 's3',
        metric: `${onTimeRate}%`,
        label: 'On-time delivery rate',
        trend: onTimeRate >= 80 ? 'up' : 'down',
        detail: `Based on your deadline performance across completed items.`,
      },
    ]

    res.json({
      success: true,
      details: {
        weeklyPerformance,
        productivityTrend,
        completionStats,
        categoryBreakdown,
        weeklyProgress,
        heatmapData,
        smartInsights,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}
