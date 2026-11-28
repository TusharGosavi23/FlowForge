
import { apiRequest } from "./api";

export const projectService = {
  getAll: () => apiRequest("/api/projects"),

  getById: (id) => apiRequest(`/api/projects/${id}`),

  create: (project) =>
    apiRequest("/api/projects", {
      method: "POST",
      body: JSON.stringify(project),
    }),

  update: (id, project) =>
    apiRequest(`/api/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(project),
    }),

  delete: (id) =>
    apiRequest(`/api/projects/${id}`, {
      method: "DELETE",
    }),
};
