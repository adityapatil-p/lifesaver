import { motion } from 'framer-motion'
import { BarChart3 } from 'lucide-react'
import {
  AnalyticsSummary,
  WeeklyPerformanceChart,
  ProductivityTrendChart,
  CompletionStatsChart,
  CategoryBreakdownChart,
} from '../components/analytics/AnalyticsCharts'

export default function Analytics() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10">
          <BarChart3 className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-zinc-100">Analytics</h1>
          <p className="text-sm text-zinc-500">Track performance and productivity trends</p>
        </div>
      </div>

      <AnalyticsSummary />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyPerformanceChart />
        <ProductivityTrendChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CompletionStatsChart />
        <CategoryBreakdownChart />
      </div>
    </motion.div>
  )
}
