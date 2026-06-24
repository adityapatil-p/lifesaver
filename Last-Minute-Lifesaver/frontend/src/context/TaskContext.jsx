/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import { allTasks as initialTasks } from '../data/mockData'

const TaskContext = createContext(null)

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(initialTasks)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const updateTaskStatus = (id, status) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)))
  }

  const reorderTasks = (newTasks) => {
    setTasks(newTasks)
  }

  const addTask = (task) => {
    setTasks((prev) => [...prev, { ...task, id: `t${Date.now()}` }])
  }

  return (
    <TaskContext.Provider value={{ tasks, isLoading, updateTaskStatus, reorderTasks, addTask, setIsLoading }}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const ctx = useContext(TaskContext)
  if (!ctx) throw new Error('useTasks must be used within TaskProvider')
  return ctx
}
