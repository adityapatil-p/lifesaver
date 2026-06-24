import { motion } from 'framer-motion'
import {
  Sparkles,
  AlertTriangle,
  Coffee,
  Users,
  Shield,
  RefreshCw,
  Brain,
} from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { aiSchedule, deadlineRisks } from '../../data/mockData'

const typeConfig = {
  focus: { icon: Brain, color: 'text-brand-400', bg: 'bg-brand-500/10' },
  break: { icon: Coffee, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  meeting: { icon: Users, color: 'text-accent-violet', bg: 'bg-accent-violet/10' },
  buffer: { icon: Shield, color: 'text-amber-400', bg: 'bg-amber-500/10' },
}

const riskColors = {
  low: 'low',
  medium: 'medium',
  high: 'critical',
}

export function AISchedule() {
  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent-violet" />
          <h3 className="font-semibold text-zinc-100">AI Generated Schedule</h3>
        </div>
        <Button variant="secondary" size="sm">
          <RefreshCw className="w-3.5 h-3.5" />
          Regenerate
        </Button>
      </div>

      <div className="relative">
        <div className="absolute left-[27px] top-4 bottom-4 w-px bg-gradient-to-b from-brand-500/50 via-accent-violet/30 to-transparent" />

        <div className="space-y-1">
          {aiSchedule.map((item, i) => {
            const config = typeConfig[item.type] || typeConfig.focus
            const Icon = config.icon

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ x: 4 }}
                className="relative flex gap-4 p-3 rounded-xl hover:bg-white/[0.03] transition-colors group"
              >
                <div className="relative z-10 flex flex-col items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${config.bg} border border-white/10`}
                  >
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                </div>

                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-brand-400">{item.time}</span>
                    <span className="text-[10px] text-zinc-600">·</span>
                    <span className="text-[10px] text-zinc-500">{item.duration}</span>
                    {item.risk && (
                      <Badge variant={riskColors[item.risk]}>
                        {item.risk} risk
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-zinc-300 group-hover:text-zinc-100 transition-colors">
                    {item.task}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </GlassCard>
  )
}

export function DeadlineRiskAnalysis() {
  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-5">
        <AlertTriangle className="w-5 h-5 text-amber-400" />
        <h3 className="font-semibold text-zinc-100">Deadline Risk Analysis</h3>
      </div>

      <div className="space-y-4">
        {deadlineRisks.map((risk, i) => (
          <motion.div
            key={risk.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-zinc-200">{risk.task}</p>
              <Badge variant={riskColors[risk.risk]}>{risk.risk}</Badge>
            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
                <span>Miss probability</span>
                <span>{risk.probability}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${risk.probability}%` }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                  className={`h-full rounded-full ${
                    risk.risk === 'high'
                      ? 'bg-red-400'
                      : risk.risk === 'medium'
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                  }`}
                />
              </div>
            </div>

            <p className="text-xs text-zinc-500 flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
              {risk.suggestion}
            </p>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  )
}

export function ProductivitySuggestions() {
  const suggestions = [
    {
      title: 'Time-block your morning',
      desc: 'Schedule deep work before 11 AM when your focus score peaks at 95%.',
    },
    {
      title: 'Reduce context switching',
      desc: 'Batch 3 similar tasks together to save ~45 minutes today.',
    },
    {
      title: 'Take strategic breaks',
      desc: 'A 15-min break after 90 min of focus can boost afternoon output by 20%.',
    },
  ]

  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-5">
        <Brain className="w-5 h-5 text-accent-cyan" />
        <h3 className="font-semibold text-zinc-100">Productivity Suggestions</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {suggestions.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -2 }}
            className="p-4 rounded-xl bg-gradient-to-br from-brand-500/5 to-accent-violet/5 border border-white/[0.05] hover:border-brand-500/15 transition-all cursor-pointer"
          >
            <p className="text-sm font-medium text-zinc-200 mb-2">{s.title}</p>
            <p className="text-xs text-zinc-500 leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  )
}
