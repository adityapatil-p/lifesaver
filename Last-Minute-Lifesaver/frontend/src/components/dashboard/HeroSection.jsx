import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Sparkles, ArrowRight, Bot, X, Plus } from 'lucide-react'
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

function QuickAddTaskModal({ onClose }) {
  const { addTask, error } = useTasks()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [deadline, setDeadline] = useState('')
  const [formError, setFormError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!title.trim()) {
      setFormError('Task title is required.')
      return
    }

    if (!deadline) {
      setFormError('Task deadline is required.')
      return
    }

    setIsSaving(true)

    try {
      await addTask({
        title: title.trim(),
        description,
        priority,
        deadline,
        status: "todo",
      })

      onClose()
    } catch (err) {
      setFormError(err?.response?.data?.error || error || 'Unable to create task. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-zinc-800 p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">Add New Task</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        {formError && (
          <div className="mb-4 rounded-md border border-red-500/25 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {formError}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="quick-title" className="block text-sm font-medium text-zinc-400 mb-1">Title</label>
            <input
              type="text"
              id="quick-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-700 border border-zinc-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="quick-description" className="block text-sm font-medium text-zinc-400 mb-1">
              Description
            </label>

            <textarea
              id="quick-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-700 border border-zinc-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              rows="3"
            />
          </div>


          <div className="mb-4">
            <label
              htmlFor="quick-deadline"
              className="block text-sm font-medium text-zinc-400 mb-1"
            >
              Deadline
            </label>

            <input
              type="datetime-local"
              id="quick-deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-zinc-700 border border-zinc-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>


          <div className="mb-6">
            <label htmlFor="quick-priority" className="block text-sm font-medium text-zinc-400 mb-1">
              Priority
            </label>

            <select
              id="quick-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-zinc-700 border border-zinc-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              <Plus className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Add Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function HeroSection() {
  const { user } = useAuth()
  const { tasks } = useTasks()
  const navigate = useNavigate()
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false)

  const criticalTasks = tasks.filter(
    (task) => task.priority === 'critical' && task.status !== 'completed' && task.status !== 'done'
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
              <Button onClick={() => navigate('/planner')}>
                <Sparkles className="w-4 h-4" />
                View AI Plan
              </Button>

              <Button variant="secondary" onClick={() => setIsQuickAddOpen(true)}>
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
      {isQuickAddOpen && <QuickAddTaskModal onClose={() => setIsQuickAddOpen(false)} />}
    </motion.section>
  )
}
