// src/api/axiosInstance.js
import axios from "axios";
import {
  getToken,
  clearToken,
  isExpired,
  scheduleLogoutCheck,
} from "./authApi/tokenManager";

export const SESSION_EXPIRED_CODE = "SESSION_EXPIRED";
export const AUTH_SKIP_HEADER = "X-Skip-Auth";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1",
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const skipAuth = Boolean(config?.headers?.[AUTH_SKIP_HEADER]);

    if (skipAuth) {
      config.__skipAuth = true;
      delete config.headers[AUTH_SKIP_HEADER];
      return config;
    }

    if (isExpired()) {
      clearToken();
      const err = new Error("Session expired");
      err.code = SESSION_EXPIRED_CODE;
      err.reason = "expired";
      throw err;
    }

    scheduleLogoutCheck();

    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const skipAuth = Boolean(error?.config?.__skipAuth);

    const isCsrfExpired = status === 419;
    if ((status === 401 || isCsrfExpired) && !skipAuth) {
      clearToken();
      const err = new Error("Session expired");
      err.code = SESSION_EXPIRED_CODE;
      err.reason = status === 401 ? "unauthorized" : "csrf";
      return Promise.reject(err);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
