import { motion } from 'framer-motion'
import { TaskBoard } from '../components/tasks/TaskBoard'
import { CheckSquare } from 'lucide-react'

export default function Tasks() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-500/10">
          <CheckSquare className="w-5 h-5 text-brand-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-zinc-100">Task Management</h1>
          <p className="text-sm text-zinc-500">Organize, prioritize, and track your work</p>
        </div>
      </div>

      <TaskBoard />
    </motion.div>
  )
}
