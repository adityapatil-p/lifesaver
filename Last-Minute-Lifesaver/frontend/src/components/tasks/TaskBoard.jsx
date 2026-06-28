import { useState, useEffect } from 'react'
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

function AddTaskModal({ onClose }) {
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting Task:", {
      title,
      description,
      priority,
      deadline,
    });

    if (!title || !deadline) {
      alert("Please select a deadline");
      return;
    }

   await addTask({
  title,
  description,
  priority,
  deadline,
  status: "todo",
});

onClose();

    
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-zinc-800 p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">Add New Task</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
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
            />
          </div>


          <div className="mb-6">
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
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditTaskModal({ task, onClose }) {
  const { updateTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('todo');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    if (!task) return;

    setTitle(task.title || '');
    setDescription(task.description || '');
    setPriority(task.priority || 'medium');
    setStatus(task.status || 'todo');

    setDeadline(
      task.deadline
        ? new Date(task.deadline).toISOString().slice(0, 16)
        : ''
    );
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return;
    await updateTask(task._id, {
      title,
      description,
      priority,
      deadline,
      status,
    });

    onClose();
  };

  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-zinc-800 p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">Edit Task</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
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
            <label htmlFor="description" className="block text-sm font-medium text-zinc-400 mb-1">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-700 border border-zinc-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              rows="3"
            ></textarea>
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
            </select>
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
            />
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
              <option value="done">Done</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}


const columns = [
  { id: 'todo', title: 'To Do', icon: ListTodo, color: 'text-yellow-400' },
  { id: 'in-progress', title: 'In Progress', icon: Loader, color: 'text-brand-400' },
  { id: 'done', title: 'Done', icon: CheckCircle2, color: 'text-emerald-400' },
]

function TaskColumn({ column, tasks, onCardClick }) {
  const Icon = column.icon

  const { setNodeRef } = useDroppable({
    id: column.id,
  });
  return (

    <div className="flex flex-col min-h-[400px]">
      <div className="flex items-center gap-2 mb-4 px-1">
        <Icon className={cn('w-4 h-4', column.color)} />
        <h3 className="text-sm font-semibold text-zinc-300">{column.title}</h3>
        <span className="ml-auto text-xs text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>

      <SortableContext items={tasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className="flex-1 space-y-3 min-h-[350px]"
        >
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} onClick={() => onCardClick(task)} />
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
  const { tasks, isLoading, updateTaskStatus, reorderTasks, setTasks } = useTasks()
  const [activeId, setActiveId] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleCardClick = (task) => {
    setSelectedTask(task)
    setIsEditModalOpen(true)
  }

  const getTasksByStatus = (status) => tasks.filter((t) => t.status === status)

  const handleDragStart = (event) => setActiveId(event.active.id)

  const handleDragOver = ({ active, over }) => {

    if (!over) return;

    const activeTask = tasks.find(
      t => t._id === active.id
    );

    if (!activeTask) return;

    let newStatus;

    if (
      over.id === "todo" ||
      over.id === "in-progress" ||
      over.id === "done"
    ) {

      newStatus = over.id;

    } else {

      const overTask = tasks.find(
        t => t._id === over.id
      );

      if (!overTask) return;

      newStatus = overTask.status;

    }

    if (activeTask.status !== newStatus) {

      setTasks(prev =>
        prev.map(task =>
          task._id === active.id
            ? {
              ...task,
              status: newStatus,
            }
            : task
        )
      );

    }

  };
  const handleDragEnd = async (event) => {
    const { active, over } = event
    setActiveId(null)
    if (!over) return

    const activeTask = tasks.find((t) => t._id === active.id)
    if (!activeTask) return
    let finalStatus = activeTask.status;

    if (
      over.id === "todo" ||
      over.id === "in-progress" ||
      over.id === "done"
    ) {
      finalStatus = over.id;
    } else {
      const overTask = tasks.find(t => t._id === over.id);

      if (overTask)
        finalStatus = overTask.status;
    }

    if (active.id !== over.id) {

      const oldIndex = tasks.findIndex(
        (t) => t._id === active.id
      );

      let newIndex;

if (
  over.id === "todo" ||
  over.id === "in-progress" ||
  over.id === "done"
) {
  newIndex = tasks.length;
} else {
  newIndex = tasks.findIndex(
    (t) => t._id === over.id
  );
}

      if (oldIndex !== -1) {

        const newTasks = tasks.map(task => ({ ...task }));

const [removed] = newTasks.splice(oldIndex, 1);

const updatedTask = {
  ...removed,
  status: finalStatus,
};

newTasks.splice(newIndex, 0, updatedTask);

await updateTaskStatus(active.id, finalStatus);

await reorderTasks(newTasks);
      }

    }
    // let finalStatus;

    // if (
    //   over.id === "todo" ||
    //   over.id === "in-progress" ||
    //   over.id === "done"
    // ) {
    //   finalStatus = over.id;
    // } else {
    //   const overTask = tasks.find(t => t._id === over.id);
    //   if (overTask) finalStatus = overTask.status;
    // }

    // updateTaskStatus(active.id, finalStatus);
  }

  const activeTask = activeId ? tasks.find((t) => t._id === activeId) : null
 

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
        <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
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
              <TaskCard task={activeTask} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
      {isAddModalOpen && <AddTaskModal onClose={() => setIsAddModalOpen(false)} />}
      {isEditModalOpen && <EditTaskModal task={selectedTask} onClose={() => setIsEditModalOpen(false)} />}
    </div>
  )
}