import { useState } from 'react'
import {
  DndContext,
  closestCenter,
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
import { Plus, ListTodo, Loader, CheckCircle2 } from 'lucide-react'
import { TaskCard } from './TaskCard'
import { useTasks } from '../../context/TaskContext'
import { Button } from '../ui/Button'
import { TaskSkeleton } from '../ui/Skeleton'
import { cn } from '../../utils/cn'

const columns = [
  { id: 'todo', title: 'To Do', icon: ListTodo, color: 'text-yellow-400' },
  { id: 'in-progress', title: 'In Progress', icon: Loader, color: 'text-brand-400' },
  { id: 'done', title: 'Done', icon: CheckCircle2, color: 'text-emerald-400' },
]

function TaskColumn({ column, tasks, onStatusChange }) {
  const Icon = column.icon

  return (
    <div className="flex flex-col min-h-[400px]">
      <div className="flex items-center gap-2 mb-4 px-1">
        <Icon className={cn('w-4 h-4', column.color)} />
        <h3 className="text-sm font-semibold text-zinc-300">{column.title}</h3>
        <span className="ml-auto text-xs text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>

      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 space-y-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onStatusChange={onStatusChange} />
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
  const { tasks, isLoading, updateTaskStatus, reorderTasks } = useTasks()
  const [activeId, setActiveId] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const getTasksByStatus = (status) => tasks.filter((t) => t.status === status)

  const handleDragStart = (event) => setActiveId(event.active.id)

  const handleDragEnd = (event) => {
    const { active, over } = event
    setActiveId(null)
    if (!over) return

    const activeTask = tasks.find((t) => t.id === active.id)
    if (!activeTask) return

    const overTask = tasks.find((t) => t.id === over.id)
    if (overTask && overTask.status !== activeTask.status) {
      updateTaskStatus(active.id, overTask.status)
    }

    if (active.id !== over.id) {
      const oldIndex = tasks.findIndex((t) => t.id === active.id)
      const newIndex = tasks.findIndex((t) => t.id === over.id)
      if (oldIndex !== -1 && newIndex !== -1) {
        const newTasks = [...tasks]
        const [removed] = newTasks.splice(oldIndex, 1)
        newTasks.splice(newIndex, 0, removed)
        reorderTasks(newTasks)
      }
    }
  }

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-zinc-500">
            {tasks.filter((t) => t.status !== 'done').length} active tasks · Drag to reorder
          </p>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
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
                onStatusChange={updateTaskStatus}
              />
            </motion.div>
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="opacity-90 rotate-2">
              <TaskCard task={activeTask} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
