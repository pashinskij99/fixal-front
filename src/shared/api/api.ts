import { sessionModel } from "@/entities/session";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use((config) => {
  const token = sessionModel.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionModel.clearToken();
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  },
);

export default api;
