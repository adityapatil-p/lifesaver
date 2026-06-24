import { motion } from 'framer-motion'
import { HeroSection } from '../components/dashboard/HeroSection'
import { FocusTasks, UpcomingDeadlines } from '../components/dashboard/FocusTasks'
import { ProductivityScore, CompletionRate } from '../components/dashboard/StatsCards'
import { AIRecommendations } from '../components/dashboard/AIRecommendations'
import { PriorityHeatmap } from '../components/dashboard/PriorityHeatmap'
import { WeeklyProgressChart } from '../components/dashboard/WeeklyProgressChart'
import { SmartInsights } from '../components/dashboard/SmartInsights'
import { DashboardSkeleton } from '../components/ui/Skeleton'
import { useTasks } from '../context/TaskContext'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function Dashboard() {
  const { isLoading } = useTasks()

  if (isLoading) return <DashboardSkeleton />

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-7xl mx-auto">
      <motion.div variants={item}>
        <HeroSection />
      </motion.div>

      <motion.div variants={item}>
        <SmartInsights />
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ProductivityScore />
        <CompletionRate />
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FocusTasks />
        <UpcomingDeadlines />
      </motion.div>

      <motion.div variants={item}>
        <WeeklyProgressChart />
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AIRecommendations />
        <PriorityHeatmap />
      </motion.div>
    </motion.div>
  )
}
