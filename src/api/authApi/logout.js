import axiosInstance from "../axiosInstance";
import apiEndpoints from "../apiEndpoints";
import { setToken } from "./tokenManager";
import Cookies from "js-cookie";

export const login = async (email, password) => {
  try {
    const { data } = await axiosInstance.post(apiEndpoints.login, {
      email,
      password,
    });
    if (data.status === "failed") throw new Error(data.message);

    const token = data?.access_token;
    const user = data?.user;
    if (!token || !user?.id)
      throw new Error("Token or user ID not found in response");

    setToken(token);
    localStorage.setItem("UserId", String(user.id));
    localStorage.setItem("user", JSON.stringify(user));
    Cookies.set("UserId", String(user.id));

    return data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Login failed"
    );
  }
};

export const logout = () => {
  setToken(null);
  localStorage.removeItem("UserId");
  localStorage.removeItem("user");
  Cookies.remove("UserId");
};
