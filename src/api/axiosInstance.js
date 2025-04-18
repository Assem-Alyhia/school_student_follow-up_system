import axios from "axios";
import { getToken } from "./authApi/tokenManager";
import { clearToken } from "./authApi/tokenManager"; 

const axiosInstance = axios.create({
  baseURL: "https://ealanatek.site/api/",
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
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized! Redirecting to login.");
      clearToken(); 
      window.location.href = "/login"; 
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
