import api from "./api";

// AI Schedule
export const getSchedule = async () => {
  const response = await api.post("/api/ai/schedule");
  return response.data;
};

// AI Prioritize
export const prioritizeTasks = async () => {
  const response = await api.post("/api/ai/prioritize");
  return response.data;
};

// AI Rescue Mode
export const rescueMode = async () => {
  const response = await api.post("/api/ai/rescue");
  return response.data;
};
