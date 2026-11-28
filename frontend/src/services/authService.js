
const AUTH_BASE_URL = "http://localhost:8080";

async function authRequest(endpoint, body) {
  const response = await fetch(`${AUTH_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || "Authentication failed.");
  }

  return data;
}

export const authService = {
  login: (credentials) => authRequest("/api/auth/login", credentials),

  register: (user) => authRequest("/api/auth/register", user),
};
