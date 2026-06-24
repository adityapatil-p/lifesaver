import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import {
  AISchedule,
  DeadlineRiskAnalysis,
  ProductivitySuggestions,
} from '../components/planner/PlannerComponents'

export default function AIPlanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-6"
    >
      <div className="relative overflow-hidden rounded-2xl glass-strong p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-accent-violet/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-violet shadow-lg shadow-brand-500/25">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-100">AI Planner</h1>
            <p className="text-sm text-zinc-400 mt-1">
              Smart scheduling powered by AI — optimized for your deadlines and energy levels
            </p>
          </div>
        </div>
      </div>

      <AISchedule />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeadlineRiskAnalysis />
        <ProductivitySuggestions />
      </div>
    </motion.div>
  )
}
