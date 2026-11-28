
import { apiRequest } from "./api";

export const taskService = {
  getByProject: (projectId) =>
    apiRequest(`/api/projects/${projectId}/tasks`),

  getById: (id) => apiRequest(`/api/tasks/${id}`),

  create: (projectId, task) =>
    apiRequest(`/api/projects/${projectId}/tasks`, {
      method: "POST",
      body: JSON.stringify(task),
    }),

  update: (id, task) =>
    apiRequest(`/api/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(task),
    }),

  delete: (id) =>
    apiRequest(`/api/tasks/${id}`, {
      method: "DELETE",
    }),
};
