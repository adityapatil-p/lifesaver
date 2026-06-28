import api from "./api";

// Get all tasks
export const getTasks = async () => {
    const response = await api.get("/tasks");
    return response.data.tasks;
};

// Create task
export const createTask = async (taskData) => {
    const response = await api.post("/tasks", taskData);
    return response.data.task;
};

// Update task
export const updateTask = async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data.task;
};

// Delete task
export const deleteTask = async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
};

// Reorder tasks
export const reorderTasks = async (taskIds) => {
    const response = await api.put("/tasks/reorder", {
        taskIds,
    });

    return response.data;
};