export const API_BASE_URL = "http://localhost:8000";

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("jobportal.access_token");
  const headers = new Headers(options.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    console.error("Unauthorized! Your session might have expired.");
    // In the future, you can add logic here to automatically log the user out.
  }

  return response;
}
