import axiosInstance from "../axiosInstance";
import apiEndpoints from "../apiEndpoints";
import { setToken } from "./tokenManager";
import Cookies from "js-cookie";

export const login = async (email, password) => {
  try {
    const response = await axiosInstance.post(apiEndpoints.login, {
      email,
      password,
    });

    console.log("Login response:", response.data);

    if (response.data.status === "failed") {
      throw new Error(response.data.message);
    }

    const token = response.data.access_token;
    const userId = response.data.user.id;

    if (!token || !userId) {
      throw new Error("Token or user ID not found in response");
    }

    setToken(token);
    localStorage.setItem("UserId", userId); // تخزين دائم
    Cookies.set("UserId", userId); // اختياري، يمكن حذفه إذا لم يُستخدم

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || "Login failed"
    );
  }
};

export const logout = () => {
  // حذف التوكن
  setToken(null);

  // حذف UserId من كل الأماكن
  localStorage.removeItem("UserId");
  Cookies.remove("UserId");
};
