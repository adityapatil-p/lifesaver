import { motion } from 'framer-motion'
import { TrendingUp, CheckCircle2 } from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { useTasks } from '../../context/TaskContext'

function isCompleted(task) {
  return task.status === 'completed' || task.status === 'done'
}

function isOverdue(task) {
  return task.deadline && !isCompleted(task) && new Date(task.deadline) < new Date()
}

function CircularProgress({
  value,
  size = 120,
  strokeWidth = 8,
  color = 'brand',
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference

  const colors = {
    brand: {
      stroke: '#6366f1',
      glow: 'shadow-brand-500/30',
    },
    emerald: {
      stroke: '#34d399',
      glow: 'shadow-emerald-500/30',
    },
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center ${colors[color].glow}`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-white/5"
        />

        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors[color].stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="text-2xl font-bold text-zinc-100"
        >
          {value}
        </motion.span>

        <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
          Score
        </span>
      </div>
    </div>
  )
}

export function ProductivityScore() {
  const { tasks } = useTasks()
  const total = tasks.length
  const completed = tasks.filter(isCompleted).length
  const critical = tasks.filter((task) => task.priority === 'critical' && !isCompleted(task)).length
  const overdue = tasks.filter(isOverdue).length
  const value = total === 0 ? 0 : Math.max(0, Math.min(100, Math.round((completed / total) * 100) + critical * 3 - overdue * 8))

  return (
    <GlassCard className="flex flex-col items-center text-center">
      <div className="flex items-center gap-2 mb-4 w-full">
        <TrendingUp className="w-5 h-5 text-brand-400" />
        <h3 className="font-semibold text-zinc-100">
          Productivity Score
        </h3>
      </div>

      <CircularProgress value={value} color="brand" />

      <p className="mt-4 text-xs text-zinc-500">
        {critical} critical · {overdue} overdue · {total - completed} pending
      </p>
    </GlassCard>
  )
}

export function CompletionRate() {
  const { tasks } = useTasks()
  const total = tasks.length
  const completed = tasks.filter(isCompleted).length
  const pending = total - completed
  const value = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <GlassCard className="flex flex-col items-center text-center">
      <div className="flex items-center gap-2 mb-4 w-full">
        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        <h3 className="font-semibold text-zinc-100">
          Completion Rate
        </h3>
      </div>

      <CircularProgress value={value} color="emerald" />

      <p className="mt-4 text-xs text-zinc-500">
        {completed} completed · {pending} pending
      </p>
    </GlassCard>
  )
}
