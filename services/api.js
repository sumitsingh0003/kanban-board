import axios from "axios";
import { getToken, logout } from "../utils/auth";

const API = axios.create({
  baseURL: "https://kanban-board-api-zsyw.onrender.com",
  withCredentials: true
});

/* ---------- REQUEST INTERCEPTOR ---------- */
API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


/* ---------- RESPONSE INTERCEPTOR ---------- */
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      logout();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

/* ---------- TASK APIs ---------- */

export const getTasks = () => API.get("/tasks");

export const createTask = (data) =>
  API.post("/tasks", data);

export const moveTask = (id, data) =>
  API.put(`/tasks/move/${id}`, data);

export default API;
