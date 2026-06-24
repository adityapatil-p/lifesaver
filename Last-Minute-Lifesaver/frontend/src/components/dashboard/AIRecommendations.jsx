import { motion } from 'framer-motion'
import { Sparkles, Zap, Clock, Brain } from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { Badge } from '../ui/Badge'
import { aiRecommendations } from '../../data/mockData'

const iconMap = {
  zap: Zap,
  clock: Clock,
  brain: Brain,
}

export function AIRecommendations() {
  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-5">
        <Sparkles className="w-5 h-5 text-accent-violet" />
        <h3 className="font-semibold text-zinc-100">AI Recommendations</h3>
      </div>

      <div className="space-y-3">
        {aiRecommendations.map((rec, i) => {
          const Icon = iconMap[rec.icon] || Sparkles
          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ x: 4 }}
              className="flex gap-4 p-4 rounded-xl bg-gradient-to-r from-brand-500/5 to-transparent border border-white/[0.05] hover:border-brand-500/15 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-500/10 shrink-0 group-hover:bg-brand-500/20 transition-colors">
                <Icon className="w-5 h-5 text-brand-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-zinc-200">{rec.title}</p>
                  <Badge variant={rec.impact === 'high' ? 'high' : 'medium'}>
                    {rec.impact} impact
                  </Badge>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">{rec.description}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </GlassCard>
  )
}
