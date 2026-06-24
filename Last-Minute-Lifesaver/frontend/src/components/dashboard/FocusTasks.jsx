import { motion } from 'framer-motion'
import { Target, Clock } from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { PriorityBadge } from '../ui/Badge'
import { focusTasks, upcomingDeadlines } from '../../data/mockData'

function formatDeadline(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = date - now
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours < 0) return 'Overdue'
  if (hours < 1) return '< 1h left'
  if (hours < 24) return `${hours}h left`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function FocusTasks() {
  return (
    <GlassCard className="h-full">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-brand-400" />
          <h3 className="font-semibold text-zinc-100">Today&apos;s Focus</h3>
        </div>
        <span className="text-xs text-zinc-500">{focusTasks.length} tasks</span>
      </div>

      <div className="space-y-3">
        {focusTasks.map((task, i) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.01, x: 4 }}
            className="group p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:border-brand-500/20 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <p className="text-sm font-medium text-zinc-200 group-hover:text-brand-200 transition-colors">
                {task.title}
              </p>
              <PriorityBadge priority={task.priority} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Clock className="w-3.5 h-3.5" />
                {formatDeadline(task.deadline)}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${task.progress}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-cyan"
                  />
                </div>
                <span className="text-xs text-zinc-500">{task.progress}%</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  )
}

export function UpcomingDeadlines() {
  return (
    <GlassCard className="h-full">
      <div className="flex items-center gap-2 mb-5">
        <Clock className="w-5 h-5 text-accent-pink" />
        <h3 className="font-semibold text-zinc-100">Upcoming Deadlines</h3>
      </div>

      <div className="space-y-2">
        {upcomingDeadlines.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors"
          >
            <div
              className={`w-2 h-2 rounded-full shrink-0 ${
                item.type === 'critical'
                  ? 'bg-red-400'
                  : item.type === 'high'
                    ? 'bg-orange-400'
                    : item.type === 'medium'
                      ? 'bg-yellow-400'
                      : 'bg-emerald-400'
              }`}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-zinc-300 truncate">{item.title}</p>
              <p className="text-xs text-zinc-500">
                {new Date(item.date).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  )
}
