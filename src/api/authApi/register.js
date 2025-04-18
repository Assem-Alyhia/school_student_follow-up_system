import axiosInstance from "../axiosInstance";
import { setToken } from "./tokenManager";
import apiEndpoints from "./../apiEndpoints";

export const signUp = async (
  firstname,
  lastname,
  email,
  username,
  phone,
  password,
  password_confirmation,
  phone_code,
  country_code
) => {
  try {
    const response = await axiosInstance.post(apiEndpoints.register, {
      firstname,
      lastname,
      email,
      username,
      phone,
      password,
      password_confirmation,
      phone_code,
      country_code,
    });

    console.log("Sign Up Response:", response.data);

    if (response.data.status === "failed") {
      throw new Error(response.data.message);
    }

    return login(username, password);
  } catch (error) {
    console.error("Sign Up Error:", error.message);
    throw error;
  }
};

export const login = async (username, password) => {
  try {
    const response = await axiosInstance.post(apiEndpoints.login, {
      username,
      password,
    });
    console.log("Login Response:", response.data);

    if (response.data.status === "failed") {
      throw new Error(response.data.message);
    }

    setToken(response.data.token);
    return response.data;
  } catch (error) {
    console.error("Login Error:", error.message);
    throw error;
  }
};
