import api from "./api";

// AI Schedule
export const getSchedule = async () => {
  const response = await api.post("/ai/schedule");
  return response.data;
};

// AI Prioritize
export const prioritizeTasks = async () => {
  const response = await api.post("/ai/prioritize");
  return response.data;
};

// AI Rescue Mode
export const rescueMode = async () => {
  const response = await api.post("/ai/rescue");
  return response.data;
};