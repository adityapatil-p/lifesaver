import { useState, useEffect, useMemo } from 'react'
import {
  DndContext,
  pointerWithin,
  useDroppable,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { motion } from 'framer-motion'
import { Plus, ListTodo, Loader, CheckCircle2, X, Save } from 'lucide-react'
import { TaskCard } from './TaskCard'
import { useTasks } from '../../context/TaskContext'
import { Button } from '../ui/Button'
import { TaskSkeleton } from '../ui/Skeleton'
import { cn } from '../../utils/cn'

const columns = [
  { id: 'todo', title: 'To Do', icon: ListTodo, color: 'text-yellow-400' },
  { id: 'in-progress', title: 'In Progress', icon: Loader, color: 'text-brand-400' },
  { id: 'completed', title: 'Completed', icon: CheckCircle2, color: 'text-emerald-400' },
]

const filters = [
  { value: 'all', label: 'All' },
  { value: 'todo', label: 'Todo' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'high', label: 'High Priority' },
  { value: 'critical', label: 'Critical' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'today', label: "Today's Tasks" },
]

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'deadline', label: 'Deadline' },
  { value: 'priority', label: 'Priority' },
  { value: 'alphabetical', label: 'Alphabetical' },
]

const priorityRank = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
}

function getTaskId(task) {
  return task?._id || task?.id
}

function isCompleted(task) {
  return task.status === 'completed' || task.status === 'done'
}

function isOverdue(task) {
  return task.deadline && !isCompleted(task) && new Date(task.deadline) < new Date()
}

function isToday(task) {
  return task.deadline && new Date(task.deadline).toDateString() === new Date().toDateString()
}

function toDateInputValue(dateStr) {
  return dateStr ? new Date(dateStr).toISOString().slice(0, 16) : ''
}

function TaskFormModal({ task, onClose }) {
  const { addTask, updateTask, error } = useTasks()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [status, setStatus] = useState('todo')
  const [deadline, setDeadline] = useState('')
  const [formError, setFormError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const isEditing = Boolean(task)

  useEffect(() => {
    if (!task) return

    setTitle(task.title || '')
    setDescription(task.description || '')
    setPriority(task.priority || 'medium')
    setStatus(task.status === 'done' ? 'completed' : task.status || 'todo')
    setDeadline(toDateInputValue(task.deadline))
  }, [task])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!title.trim()) {
      setFormError('Task title is required.')
      return
    }

    if (!deadline) {
      setFormError('Task deadline is required.')
      return
    }

    setIsSaving(true)

    try {
      const payload = {
        title: title.trim(),
        description,
        priority,
        deadline,
        status,
      }

      if (isEditing) {
        await updateTask(getTaskId(task), payload)
      } else {
        await addTask(payload)
      }

      onClose()
    } catch (err) {
      setFormError(err?.response?.data?.error || error || 'Unable to save task. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-zinc-800 p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">{isEditing ? 'Edit Task' : 'Add New Task'}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        {formError && (
          <div className="mb-4 rounded-md border border-red-500/25 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {formError}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-zinc-400 mb-1">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-700 border border-zinc-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-zinc-400 mb-1">
              Description
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-700 border border-zinc-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              rows="3"
            />
          </div>


          <div className="mb-4">
            <label
              htmlFor="deadline"
              className="block text-sm font-medium text-zinc-400 mb-1"
            >
              Deadline
            </label>

            <input
              type="datetime-local"
              id="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-zinc-700 border border-zinc-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>


          <div className="mb-4">
            <label htmlFor="priority" className="block text-sm font-medium text-zinc-400 mb-1">
              Priority
            </label>

            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-zinc-700 border border-zinc-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="status" className="block text-sm font-medium text-zinc-400 mb-1">
              Status
            </label>

            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-zinc-700 border border-zinc-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              {isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function TaskColumn({ column, tasks, onCardClick }) {
  const Icon = column.icon

  const { setNodeRef } = useDroppable({
    id: column.id,
  })
  return (

    <div className="flex flex-col min-h-[400px]">
      <div className="flex items-center gap-2 mb-4 px-1">
        <Icon className={cn('w-4 h-4', column.color)} />
        <h3 className="text-sm font-semibold text-zinc-300">{column.title}</h3>
        <span className="ml-auto text-xs text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>

      <SortableContext items={tasks.map((t) => getTaskId(t))} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className="flex-1 space-y-3 min-h-[350px]"
        >
          {tasks.map((task) => (
            <TaskCard key={getTaskId(task)} task={task} onEdit={() => onCardClick(task)} />
          ))}
          {tasks.length === 0 && (
            <div className="flex items-center justify-center h-32 rounded-xl border border-dashed border-white/10 text-xs text-zinc-600">
              Drop tasks here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  )
}

export function TaskBoard() {
  const {
    tasks,
    isLoading,
    error,
    notice,
    updateTaskStatus,
    reorderTasks,
    setTasks,
    clearNotice,
  } = useTasks()
  const [activeId, setActiveId] = useState(null)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('deadline')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase()

    return [...tasks]
      .filter((task) => {
        const matchesSearch = !query ||
          task.title?.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query)

        if (!matchesSearch) return false

        if (filter === 'all') return true
        if (filter === 'todo') return task.status === 'todo'
        if (filter === 'in-progress') return task.status === 'in-progress'
        if (filter === 'completed') return isCompleted(task)
        if (filter === 'high') return task.priority === 'high'
        if (filter === 'critical') return task.priority === 'critical'
        if (filter === 'overdue') return isOverdue(task)
        if (filter === 'today') return isToday(task)

        return true
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        if (sortBy === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
        if (sortBy === 'deadline') return new Date(a.deadline || 8640000000000000) - new Date(b.deadline || 8640000000000000)
        if (sortBy === 'priority') return (priorityRank[b.priority] || 0) - (priorityRank[a.priority] || 0)
        if (sortBy === 'alphabetical') return (a.title || '').localeCompare(b.title || '')

        return 0
      })
  }, [filter, search, sortBy, tasks])

  const handleCardClick = (task) => {
    setSelectedTask(task)
    setIsTaskModalOpen(true)
  }

  const handleAddClick = () => {
    setSelectedTask(null)
    setIsTaskModalOpen(true)
  }

  const getTasksByStatus = (status) => filteredTasks.filter((t) => {
    if (status === 'completed') return isCompleted(t)
    return t.status === status
  })

  const handleDragStart = (event) => setActiveId(event.active.id)

  const handleDragOver = ({ active, over }) => {
    if (!over) return

    const activeTask = tasks.find((task) => getTaskId(task) === active.id)

    if (!activeTask) return

    let newStatus

    if (columns.some((column) => column.id === over.id)) {
      newStatus = over.id
    } else {
      const overTask = tasks.find((task) => getTaskId(task) === over.id)
      if (!overTask) return
      newStatus = overTask.status === 'done' ? 'completed' : overTask.status
    }

    if (activeTask.status !== newStatus) {
      setTasks((prev) =>
        prev.map((task) =>
          getTaskId(task) === active.id
            ? {
                ...task,
                status: newStatus,
              }
            : task
        )
      )
    }
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event
    setActiveId(null)
    if (!over) return

    const activeTask = tasks.find((t) => getTaskId(t) === active.id)
    if (!activeTask) return

    let finalStatus = activeTask.status === 'done' ? 'completed' : activeTask.status

    if (columns.some((column) => column.id === over.id)) {
      finalStatus = over.id
    } else {
      const overTask = tasks.find((t) => getTaskId(t) === over.id)

      if (overTask) {
        finalStatus = overTask.status === 'done' ? 'completed' : overTask.status
      }
    }

    const oldIndex = tasks.findIndex((t) => getTaskId(t) === active.id)
    const newIndex = columns.some((column) => column.id === over.id)
      ? tasks.length
      : tasks.findIndex((t) => getTaskId(t) === over.id)

    if (oldIndex === -1) return

    const newTasks = tasks.map((task) => ({ ...task }))
    const [removed] = newTasks.splice(oldIndex, 1)
    const updatedTask = {
      ...removed,
      status: finalStatus,
    }

    newTasks.splice(newIndex === -1 ? newTasks.length : newIndex, 0, updatedTask)

    if (activeTask.status !== finalStatus) {
      await updateTaskStatus(active.id, finalStatus)
    }

    await reorderTasks(newTasks)
  }

  const activeTask = activeId ? tasks.find((t) => getTaskId(t) === activeId) : null

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => (
          <div key={col.id} className="space-y-3">
            <TaskSkeleton />
            <TaskSkeleton />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      {(notice || error) && (
        <div className={cn(
          'mb-4 rounded-md border px-3 py-2 text-sm',
          (notice?.type === 'error' || error) ? 'border-red-500/25 bg-red-500/10 text-red-400' : 'border-emerald-500/25 bg-emerald-500/10 text-emerald-400'
        )}>
          <div className="flex items-center justify-between gap-3">
            <span>{notice?.message || error}</span>
            <button type="button" onClick={clearNotice} className="text-xs opacity-70 hover:opacity-100">
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-500">
              {tasks.filter((t) => !isCompleted(t)).length} active tasks · Drag to reorder
            </p>
          </div>
          <Button size="sm" onClick={handleAddClick}>
            <Plus className="w-4 h-4" />
            Add Task
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {filters.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {sortOptions.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column, i) => (
            <motion.div
              key={column.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <TaskColumn
                column={column}
                tasks={getTasksByStatus(column.id)}
                onCardClick={handleCardClick}
              />
            </motion.div>
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="opacity-90 rotate-2">
              <TaskCard task={activeTask} onEdit={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
      {isTaskModalOpen && <TaskFormModal task={selectedTask} onClose={() => setIsTaskModalOpen(false)} />}
    </div>
  )
}
