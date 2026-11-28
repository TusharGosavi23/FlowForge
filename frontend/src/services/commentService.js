import { apiRequest } from "./api";

export const commentService = {
  getByTask: (taskId) =>
    apiRequest(`/api/tasks/${taskId}/comments`),

  create: (taskId, content) =>
    apiRequest(`/api/tasks/${taskId}/comments`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),
};