import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Lightbulb } from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { smartInsights } from '../../data/mockData'

export function SmartInsights() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {smartInsights.map((insight, i) => (
        <motion.div
          key={insight.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <GlassCard className="h-full">
            <div className="flex items-start justify-between mb-3">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              {insight.trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-brand-400" />
              )}
            </div>
            <p className="text-2xl font-bold gradient-text mb-1">{insight.metric}</p>
            <p className="text-sm font-medium text-zinc-300 mb-2">{insight.label}</p>
            <p className="text-xs text-zinc-500 leading-relaxed">{insight.detail}</p>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  )
}
