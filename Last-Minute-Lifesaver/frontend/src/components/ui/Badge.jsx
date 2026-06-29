import { cn } from '../../utils/cn'

const variants = {
  critical: 'bg-red-500/15 text-red-400 border-red-500/25',
  high: 'bg-orange-500/15 text-orange-400 border-orange-500/25',
  medium: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  low: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/25',
  success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  default: 'bg-brand-500/15 text-brand-400 border-brand-500/25',
}

export function Badge({ children, variant = 'default', className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize',
        variants[variant] || variants.default,
        className
      )}
    >
      {children}
    </span>
  )
}

export function PriorityBadge({ priority }) {
  return <Badge variant={priority}>{priority}</Badge>
}

export function StatusBadge({ status }) {
  const statusVariants = {
    'in-progress': 'default',
    todo: 'medium',
    completed: 'success',
    done: 'success',
  }
  const labels = {
    'in-progress': 'In Progress',
    todo: 'To Do',
    completed: 'Completed',
    done: 'Completed',
  }
  return <Badge variant={statusVariants[status] || 'default'}>{labels[status] || status}</Badge>
}
