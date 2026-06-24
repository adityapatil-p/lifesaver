import { motion } from 'framer-motion'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Clock, Calendar, Tag } from 'lucide-react'
import { PriorityBadge, StatusBadge } from '../ui/Badge'
import { cn } from '../../utils/cn'

function formatDeadline(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function isOverdue(dateStr) {
  return new Date(dateStr) < new Date()
}

export function TaskCard({ task, onStatusChange }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const overdue = isOverdue(task.deadline) && task.status !== 'done'

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: isDragging ? 0.5 : 1, scale: 1 }}
      whileHover={{ y: -2 }}
      className={cn(
        'group glass rounded-xl p-4 border transition-all duration-200',
        isDragging && 'shadow-2xl shadow-brand-500/20 z-50',
        overdue ? 'border-red-500/30' : 'border-white/[0.05] hover:border-brand-500/20'
      )}
    >
      <div className="flex items-start gap-3">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 p-1 rounded text-zinc-600 hover:text-zinc-400 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4
              className={cn(
                'text-sm font-medium text-zinc-200',
                task.status === 'done' && 'line-through text-zinc-500'
              )}
            >
              {task.title}
            </h4>
            <PriorityBadge priority={task.priority} />
          </div>

          {task.description && (
            <p className="text-xs text-zinc-500 mb-3 line-clamp-2">{task.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <StatusBadge status={task.status} />
            <span className="inline-flex items-center gap-1 text-[10px] text-zinc-500 px-2 py-0.5 rounded-full bg-white/[0.03]">
              <Tag className="w-3 h-3" />
              {task.category}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div
              className={cn(
                'flex items-center gap-1.5 text-xs',
                overdue ? 'text-red-400' : 'text-zinc-500'
              )}
            >
              <Calendar className="w-3.5 h-3.5" />
              {formatDeadline(task.deadline)}
              {overdue && <span className="font-medium">· Overdue</span>}
            </div>

            {task.status !== 'done' && (
              <button
                onClick={() => onStatusChange?.(task.id, 'done')}
                className="text-[10px] text-brand-400 hover:text-brand-300 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Mark done
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function TaskCardStatic({ task }) {
  const overdue = isOverdue(task.deadline) && task.status !== 'done'

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        'glass rounded-xl p-4 border border-white/[0.05] hover:border-brand-500/20 transition-all',
        overdue && 'border-red-500/30'
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-medium text-zinc-200">{task.title}</h4>
        <PriorityBadge priority={task.priority} />
      </div>
      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
        <Clock className="w-3.5 h-3.5" />
        {formatDeadline(task.deadline)}
      </div>
    </motion.div>
  )
}
