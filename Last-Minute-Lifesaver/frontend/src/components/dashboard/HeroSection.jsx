import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Bot } from 'lucide-react'
import { Button } from '../ui/Button'
import { useAuth } from '../../context/AuthContext'
import { useTasks } from '../../context/TaskContext'

const greetings = [
  'Good morning',
  'Good afternoon',
  'Good evening',
]

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return greetings[0]
  if (hour < 17) return greetings[1]
  return greetings[2]
}

export function HeroSection() {
  const { user } = useAuth()
  const { tasks } = useTasks()

  const criticalTasks = tasks.filter(
    (task) => task.priority === 'critical' && task.status !== 'done'
  ).length

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl gradient-border"
    >
      <div className="relative glass-strong rounded-2xl p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-brand-500/20 via-accent-violet/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-accent-cyan/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-4 max-w-xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-brand-300"
            >
              <Bot className="w-3.5 h-3.5" />
              AI Assistant Active
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </motion.div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              {getGreeting()},{' '}
              <span className="gradient-text">
                {user?.name || 'User'}
              </span>
            </h1>

            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              You have{' '}
              <span className="text-brand-300 font-semibold">
                {criticalTasks} critical task{criticalTasks !== 1 ? 's' : ''}
              </span>{' '}
              pending. Your dashboard is synchronized with the backend and ready
              for today's work.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button>
                <Sparkles className="w-4 h-4" />
                View AI Plan
              </Button>

              <Button variant="secondary">
                Quick Add Task
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="hidden lg:block relative w-48 h-48"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-500/30 to-accent-violet/20 animate-pulse" />

            <div className="absolute inset-4 rounded-full glass flex items-center justify-center">
              <Sparkles className="w-16 h-16 text-brand-400" />
            </div>

            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute inset-0 rounded-full border border-dashed border-brand-500/20"
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}