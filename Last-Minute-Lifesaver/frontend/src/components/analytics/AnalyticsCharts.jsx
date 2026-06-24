import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { GlassCard } from '../ui/GlassCard'
import { analyticsData } from '../../data/mockData'
import { useTheme } from '../../context/ThemeContext'
import { TrendingUp, BarChart3, PieChart as PieIcon, Layers } from 'lucide-react'

function ChartTooltip({ active, payload, label }) {
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

export function WeeklyPerformanceChart() {
  const { isDark } = useTheme()
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
  const textColor = isDark ? '#71717a' : '#a1a1aa'

  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-5">
        <BarChart3 className="w-5 h-5 text-brand-400" />
        <h3 className="font-semibold text-zinc-100">Weekly Performance</h3>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={analyticsData.weeklyPerformance}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="week" tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, color: textColor }} />
            <Bar dataKey="tasks" name="Total Tasks" fill="rgba(99,102,241,0.3)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="completed" name="Completed" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  )
}

export function ProductivityTrendChart() {
  const { isDark } = useTheme()
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
  const textColor = isDark ? '#71717a' : '#a1a1aa'

  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp className="w-5 h-5 text-emerald-400" />
        <h3 className="font-semibold text-zinc-100">Productivity Trends</h3>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={analyticsData.productivityTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="date" tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[60, 100]} tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Line
              type="monotone"
              dataKey="score"
              name="Productivity Score"
              stroke="#34d399"
              strokeWidth={2}
              dot={{ fill: '#34d399', strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, fill: '#34d399' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  )
}

export function CompletionStatsChart() {
  const { isDark } = useTheme()
  const textColor = isDark ? '#71717a' : '#a1a1aa'

  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-5">
        <PieIcon className="w-5 h-5 text-accent-pink" />
        <h3 className="font-semibold text-zinc-100">Completion Statistics</h3>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={analyticsData.completionStats}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
            >
              {analyticsData.completionStats.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
            <Legend
              verticalAlign="bottom"
              wrapperStyle={{ fontSize: 12, color: textColor }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  )
}

export function CategoryBreakdownChart() {
  const { isDark } = useTheme()
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
  const textColor = isDark ? '#71717a' : '#a1a1aa'

  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-5">
        <Layers className="w-5 h-5 text-accent-violet" />
        <h3 className="font-semibold text-zinc-100">Tasks by Category</h3>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={analyticsData.categoryBreakdown} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
            <XAxis type="number" tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis
              dataKey="category"
              type="category"
              tick={{ fill: textColor, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={100}
            />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="count" name="Tasks" fill="url(#categoryGradient)" radius={[0, 4, 4, 0]} />
            <defs>
              <linearGradient id="categoryGradient" x1="0" y1="0" x2="1" y2="0">
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

export function AnalyticsSummary() {
  const stats = [
    { label: 'Tasks Completed', value: '247', change: '+12%' },
    { label: 'Avg. Productivity', value: '84', change: '+8%' },
    { label: 'Focus Hours', value: '156h', change: '+15%' },
    { label: 'On-time Rate', value: '89%', change: '+3%' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
        >
          <GlassCard hover={false} className="text-center">
            <p className="text-2xl font-bold gradient-text">{stat.value}</p>
            <p className="text-xs text-zinc-500 mt-1">{stat.label}</p>
            <p className="text-xs text-emerald-400 mt-2">{stat.change}</p>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  )
}
