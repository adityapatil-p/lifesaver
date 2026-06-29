/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import {
  getTasks as getTasksService,
  createTask as createTaskService,
  updateTask as updateTaskService,
  deleteTask as deleteTaskService,
  reorderTasks as reorderTasksService,
  completeTask as completeTaskService,
  updateTaskStatus as updateTaskStatusService,
  updateTaskPriority as updateTaskPriorityService,
} from "../services/taskService";
import { useAuth } from "./AuthContext";

const TaskContext = createContext(null);

const friendlyMessages = {
  400: "Please check the task details and try again.",
  401: "Your session has expired. Please sign in again.",
  403: "You do not have permission to update this task.",
  404: "That task could not be found.",
  409: "This task was changed elsewhere. Please refresh and try again.",
  500: "The server had trouble saving your task. Please try again.",
};

function normalizeTask(task) {
  if (!task) return task;

  return {
    ...task,
    status: task.status === "done" ? "completed" : task.status,
  };
}

function normalizeTasks(tasks) {
  return Array.isArray(tasks) ? tasks.map(normalizeTask) : [];
}

function getTaskId(task) {
  return task?._id || task?.id;
}

function getErrorMessage(error) {
  const status = error?.response?.status;
  return error?.response?.data?.error || friendlyMessages[status] || "Something went wrong. Please try again.";
}

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  const { token } = useAuth();

  const showNotice = useCallback((message, type = "success") => {
    setNotice({ message, type });
  }, []);

  const clearNotice = useCallback(() => {
    setNotice(null);
  }, []);

  const fetchTasks = useCallback(async () => {
    if (!token) {
      setTasks([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const fetchedTasks = await getTasksService();
      setTasks(normalizeTasks(fetchedTasks));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const replaceTask = useCallback((updatedTask) => {
    const normalized = normalizeTask(updatedTask);
    const updatedId = getTaskId(normalized);

    setTasks((prev) =>
      prev.map((task) => (getTaskId(task) === updatedId ? normalized : task))
    );

    return normalized;
  }, []);

  const updateTaskStatus = useCallback(async (id, status) => {
    const normalizedStatus = status === "done" ? "completed" : status;
    const originalTasks = tasks;

    setTasks((prev) =>
      prev.map((task) =>
        getTaskId(task) === id
          ? {
              ...task,
              status: normalizedStatus,
              completedAt: normalizedStatus === "completed" ? task.completedAt || new Date().toISOString() : undefined,
              progress: normalizedStatus === "completed" ? 100 : task.progress,
            }
          : task
      )
    );

    try {
      const updatedTask = await updateTaskStatusService(id, normalizedStatus);
      return replaceTask(updatedTask);
    } catch (err) {
      setTasks(originalTasks);
      const message = getErrorMessage(err);
      setError(message);
      showNotice(message, "error");
      throw err;
    }
  }, [replaceTask, showNotice, tasks]);

  const updateTaskPriority = useCallback(async (id, priority) => {
    const originalTasks = tasks;

    setTasks((prev) =>
      prev.map((task) => (getTaskId(task) === id ? { ...task, priority } : task))
    );

    try {
      const updatedTask = await updateTaskPriorityService(id, priority);
      return replaceTask(updatedTask);
    } catch (err) {
      setTasks(originalTasks);
      const message = getErrorMessage(err);
      setError(message);
      showNotice(message, "error");
      throw err;
    }
  }, [replaceTask, showNotice, tasks]);

  const completeTask = useCallback(async (id) => {
    const originalTasks = tasks;
    const completedAt = new Date().toISOString();

    setTasks((prev) =>
      prev.map((task) =>
        getTaskId(task) === id
          ? { ...task, status: "completed", completedAt, progress: 100 }
          : task
      )
    );

    try {
      const updatedTask = await completeTaskService(id);
      showNotice("Task completed.");
      return replaceTask(updatedTask);
    } catch (err) {
      setTasks(originalTasks);
      const message = getErrorMessage(err);
      setError(message);
      showNotice(message, "error");
      throw err;
    }
  }, [replaceTask, showNotice, tasks]);

  const updateTask = useCallback(async (id, taskData) => {
    const originalTasks = tasks;
    const optimisticData = {
      ...taskData,
      status: taskData.status === "done" ? "completed" : taskData.status,
    };

    setTasks((prev) =>
      prev.map((task) =>
        getTaskId(task) === id
          ? { ...task, ...optimisticData }
          : task
      )
    );

    try {
      const updatedTask = await updateTaskService(id, optimisticData);
      showNotice("Task updated.");
      return replaceTask(updatedTask);
    } catch (err) {
      setTasks(originalTasks);
      const message = getErrorMessage(err);
      setError(message);
      showNotice(message, "error");
      throw err;
    }
  }, [replaceTask, showNotice, tasks]);

  const reorderTasks = useCallback(async (newTasks) => {
    const originalTasks = tasks;
    const normalized = normalizeTasks(newTasks);

    setTasks(normalized);

    try {
      const taskIds = normalized.map((task) => getTaskId(task));
      await reorderTasksService(taskIds);
    } catch (err) {
      setTasks(originalTasks);
      const message = getErrorMessage(err);
      setError(message);
      showNotice(message, "error");
    }
  }, [showNotice, tasks]);

  const addTask = useCallback(async (task) => {
    setError(null);

    try {
      const newTask = await createTaskService({
        ...task,
        status: task.status === "done" ? "completed" : task.status || "todo",
      });

      setTasks((prev) => [...prev, normalizeTask(newTask)]);
      showNotice("Task created.");
      return normalizeTask(newTask);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      showNotice(message, "error");
      throw err;
    }
  }, [showNotice]);

  const deleteTask = useCallback(async (id) => {
    const originalTasks = tasks;

    setTasks((prev) => prev.filter((task) => getTaskId(task) !== id));

    try {
      await deleteTaskService(id);
      showNotice("Task deleted.");
    } catch (err) {
      setTasks(originalTasks);
      const message = getErrorMessage(err);
      setError(message);
      showNotice(message, "error");
      throw err;
    }
  }, [showNotice, tasks]);

  const value = useMemo(() => ({
    tasks,
    isLoading,
    error,
    notice,
    fetchTasks,
    updateTaskStatus,
    updateTaskPriority,
    completeTask,
    reorderTasks,
    addTask,
    updateTask,
    deleteTask,
    setTasks,
    clearNotice,
    showNotice,
  }), [
    tasks,
    isLoading,
    error,
    notice,
    fetchTasks,
    updateTaskStatus,
    updateTaskPriority,
    completeTask,
    reorderTasks,
    addTask,
    updateTask,
    deleteTask,
    clearNotice,
    showNotice,
  ]);

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
