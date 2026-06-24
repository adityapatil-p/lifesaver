import { motion } from 'framer-motion'
import { Grid3X3 } from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { heatmapData } from '../../data/mockData'

const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

function getHeatColor(value) {
  if (value === 0) return 'bg-white/[0.03]'
  if (value <= 1) return 'bg-brand-500/20'
  if (value <= 2) return 'bg-brand-500/35'
  if (value <= 3) return 'bg-brand-500/50'
  if (value <= 4) return 'bg-brand-500/70'
  return 'bg-brand-500'
}

export function PriorityHeatmap() {
  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Grid3X3 className="w-5 h-5 text-accent-cyan" />
          <h3 className="font-semibold text-zinc-100">Task Priority Heatmap</h3>
        </div>
        <span className="text-xs text-zinc-500">This week</span>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[280px]">
          <div className="grid grid-cols-8 gap-1 mb-1">
            <div />
            {dayLabels.map((d, i) => (
              <div key={i} className="text-center text-[10px] text-zinc-500 font-medium">
                {d}
              </div>
            ))}
          </div>

          {heatmapData.map((row, rowIdx) => (
            <div key={row.hour} className="grid grid-cols-8 gap-1 mb-1">
              <div className="text-[10px] text-zinc-500 flex items-center">{row.hour}</div>
              {days.map((day, colIdx) => (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: rowIdx * 0.03 + colIdx * 0.01 }}
                  whileHover={{ scale: 1.2 }}
                  className={`aspect-square rounded-sm ${getHeatColor(row[day])} transition-colors cursor-pointer`}
                  title={`${row.hour} ${day}: ${row[day]} tasks`}
                />
              ))}
            </div>
          ))}

          <div className="flex items-center justify-end gap-2 mt-4">
            <span className="text-[10px] text-zinc-500">Less</span>
            {[0, 1, 2, 3, 4, 5].map((v) => (
              <div key={v} className={`w-3 h-3 rounded-sm ${getHeatColor(v)}`} />
            ))}
            <span className="text-[10px] text-zinc-500">More</span>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
