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
    if (!token) {
      throw new Error("Token not found in response");
    }

    setToken(token);
    // لا يوجد userId في الرد الحالي، يمكن إضافته لاحقًا عند توفره
    // Cookies.set("UserId", response.data.id);

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || "Login failed"
    );
  }
};
