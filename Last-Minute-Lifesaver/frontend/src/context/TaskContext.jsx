/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  getTasks as getTasksService,
  createTask as createTaskService,
  updateTask as updateTaskService,
  deleteTask as deleteTaskService,
  reorderTasks as reorderTasksService,
} from "../services/taskService";
import { useAuth } from "./AuthContext";

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { token } = useAuth();

  const fetchTasks = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const fetchedTasks = await getTasksService();
      setTasks(fetchedTasks);
    } catch (err) {
      setError(err.message || "Failed to fetch tasks");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ------------------------
  // Change Status
  // ------------------------

  const updateTaskStatus = async (id, status) => {
    try {
      const updatedTask = await updateTaskService(id, { status });

      setTasks((prev) =>
        prev.map((task) =>
          task._id === id ? updatedTask : task
        )
      );
    } catch (err) {
      console.error("Failed to update task status:", err);
    }
  };

  // ------------------------
  // Edit Task
  // ------------------------

  const updateTask = async (id, taskData) => {
    try {
      const updatedTask = await updateTaskService(id, taskData);

      setTasks((prev) =>
        prev.map((task) =>
          task._id === id ? updatedTask : task
        )
      );

      return updatedTask;
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  // ------------------------
  // Reorder
  // ------------------------

  const reorderTasks = async (newTasks) => {
    const originalTasks = tasks;

    setTasks(newTasks);

    try {
      const taskIds = newTasks.map((task) => task._id);

      await reorderTasksService(taskIds);
    } catch (err) {
      console.error("Failed to reorder tasks:", err);
      setTasks(originalTasks);
    }
  };

  // ------------------------
  // Add Task
  // ------------------------

  const addTask = async (task) => {
    try {
      const newTask = await createTaskService(task);

      setTasks((prev) => [...prev, newTask]);

      return newTask;
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  // ------------------------
  // Delete Task
  // ------------------------

  const deleteTask = async (id) => {
    try {
      await deleteTaskService(id);

      setTasks((prev) =>
        prev.filter((task) => task._id !== id)
      );
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const value = {
    tasks,
    isLoading,
    error,
    fetchTasks,
    updateTaskStatus,
    reorderTasks,
    addTask,
    updateTask,
    deleteTask,
    setTasks,
  };
  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error("useTasks must be used within TaskProvider");
  }

  return context;
}