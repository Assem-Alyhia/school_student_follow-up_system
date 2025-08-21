// axiosInstance.js
import axios from "axios";
import {
  getToken,
  clearToken,
  isExpired,
  scheduleLogoutCheck,
} from "./authApi/tokenManager";

export const SESSION_EXPIRED_CODE = "SESSION_EXPIRED";
export const AUTH_SKIP_HEADER = "X-Skip-Auth"; // <-- جديد

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

    if (!skipAuth) {
      if (isExpired()) {
        clearToken();
        const err = new Error("Session expired");
        err.code = SESSION_EXPIRED_CODE;
        err.reason = "expired";
        throw err;
      }

      // أعِد ضبط المؤقّت
      scheduleLogoutCheck();

      const token = getToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } else {
      // لا نريد إرسال الهيدر هذا إلى الخادم
      delete config.headers[AUTH_SKIP_HEADER];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const skipAuth = Boolean(error?.config?.headers?.[AUTH_SKIP_HEADER]);

    // 401 من السيرفر تعتبر انتهاء جلسة لكن فقط للطلبات التي تتطلب أوث
    if (status === 401 && !skipAuth) {
      clearToken();
      const err = new Error("Session expired");
      err.code = SESSION_EXPIRED_CODE;
      err.reason = "unauthorized";
      return Promise.reject(err);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
