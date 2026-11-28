
const API_BASE_URL = "http://localhost:8081";

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("Unauthorized. Please login again.");
    }

    const errorText = await response.text();
    throw new Error(errorText || `API Error: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
