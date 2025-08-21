// authApi/index.js
import axiosInstance from "../axiosInstance";
import apiEndpoints from "../apiEndpoints";
import { setToken, SESSION_DURATION_MS, clearToken } from "./tokenManager";
import Cookies from "js-cookie";
import { AUTH_SKIP_HEADER } from "../axiosInstance"; // <-- للحصول على اسم الهيدر

export const login = async (email, password) => {
  try {
    // الهيدر X-Skip-Auth يمنع الـinterceptor من رفض طلب /login
    const { data } = await axiosInstance.post(
      apiEndpoints.login,
      { email, password },
      { headers: { [AUTH_SKIP_HEADER]: true } }
    );

    if (data.status === "failed") throw new Error(data.message);

    const token = data?.access_token;
    const user = data?.user;
    if (!token || !user?.id)
      throw new Error("Token or user ID not found in response");

    // وقت الانتهاء الجديد لكل دخول ناجح
    const expiresAt = Date.now() + SESSION_DURATION_MS;

    setToken(token, expiresAt);
    localStorage.setItem("UserId", String(user.id));
    localStorage.setItem("user", JSON.stringify(user));

    Cookies.set("UserId", String(user.id), { expires: new Date(expiresAt) });

    return data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Login failed"
    );
  }
};

export const logout = () => {
  clearToken();
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};
