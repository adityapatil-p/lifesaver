import { motion } from 'framer-motion'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Clock, Calendar, Trash2, Pencil, CheckCircle2, AlertTriangle } from 'lucide-react'
import { PriorityBadge, StatusBadge, Badge } from '../ui/Badge'
import { cn } from '../../utils/cn'
import { useTasks } from '../../context/TaskContext'

function formatDate(dateStr) {
  if (!dateStr) return 'No date'

  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatDeadline(dateStr) {
  if (!dateStr) return 'No deadline'

  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function isCompleted(task) {
  return task.status === 'completed' || task.status === 'done'
}

function isOverdue(task) {
  if (!task.deadline || isCompleted(task)) return false
  return new Date(task.deadline) < new Date()
}

function getTaskId(task) {
  return task?._id || task?.id
}

export function TaskCard({ task, onEdit }) {
  const { deleteTask, completeTask } = useTasks()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: getTaskId(task) })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const overdue = isOverdue(task)
  const completed = isCompleted(task)

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (window.confirm('Delete this task? This cannot be undone.')) {
      await deleteTask(getTaskId(task))
    }
  }

  const handleComplete = async (e) => {
    e.stopPropagation()
    if (!completed) {
      await completeTask(getTaskId(task))
    }
  }

  const handleEdit = (e) => {
    e.stopPropagation()
    onEdit(task)
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: isDragging ? 0.5 : 1, scale: 1 }}
      whileHover={{ y: -2 }}
      className={cn(
        'group glass rounded-xl p-4 border transition-all duration-200 cursor-pointer',
        isDragging && 'shadow-2xl shadow-brand-500/20 z-50',
        overdue ? 'border-red-500/30' : 'border-white/[0.05] hover:border-brand-500/20'
      )}
      onClick={handleEdit}
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
                completed && 'line-through text-zinc-500'
              )}
            >
              {task.title}
            </h4>
            <PriorityBadge priority={task.priority || 'medium'} />
          </div>

          <p className="text-xs text-zinc-500 mb-3 line-clamp-2">
            {task.description || 'No description'}
          </p>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <StatusBadge status={completed ? 'completed' : task.status} />
            {overdue && (
              <Badge variant="critical" className="gap-1">
                <AlertTriangle className="w-3 h-3" />
                Overdue
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            <div
              className={cn(
                'flex items-center gap-1.5 text-xs',
                overdue ? 'text-red-400' : 'text-zinc-500'
              )}
            >
              <Calendar className="w-3.5 h-3.5" />
              {formatDeadline(task.deadline)}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <Clock className="w-3.5 h-3.5" />
              Created {formatDate(task.createdAt)}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleEdit}
              className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-brand-300 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
            <button
              type="button"
              onClick={handleComplete}
              disabled={completed}
              className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-emerald-400 disabled:text-emerald-500 disabled:cursor-default transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Complete
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function TaskCardStatic({ task }) {
  const overdue = isOverdue(task)

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
        <PriorityBadge priority={task.priority || 'medium'} />
      </div>
      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
        <Clock className="w-3.5 h-3.5" />
        {formatDeadline(task.deadline)}
      </div>
    </motion.div>
  )
}
