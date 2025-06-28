import axios from "axios";
import { getToken, clearToken } from "./authApi/tokenManager";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1/",
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
