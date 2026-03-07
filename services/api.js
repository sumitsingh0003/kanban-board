import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const getTasks = () => API.get("/tasks");

export const createTask = (title) =>
  API.post("/tasks", { title });

export const moveTask = (id, data) =>
  API.put(`/tasks/move/${id}`, data);