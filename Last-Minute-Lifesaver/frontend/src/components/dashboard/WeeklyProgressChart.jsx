import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import { BarChart3 } from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { weeklyProgress } from '../../data/mockData'
import { useTheme } from '../../context/ThemeContext'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="font-medium text-zinc-200 mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  )
}

export function WeeklyProgressChart() {
  const { isDark } = useTheme()
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
  const textColor = isDark ? '#71717a' : '#a1a1aa'

  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-5">
        <BarChart3 className="w-5 h-5 text-brand-400" />
        <h3 className="font-semibold text-zinc-100">Weekly Progress</h3>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyProgress} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="day" tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.1)' }} />
            <Bar
              dataKey="planned"
              name="Planned"
              fill="rgba(99,102,241,0.2)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="completed"
              name="Completed"
              fill="url(#barGradient)"
              radius={[4, 4, 0, 0]}
            />
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  )
}

export function FocusTrendChart({ data, title = 'Focus Score' }) {
  const { isDark } = useTheme()
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
  const textColor = isDark ? '#71717a' : '#a1a1aa'

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="day" tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="focus"
            name={title}
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#areaGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
