import axiosInstance from "../axiosInstance";
import { setToken } from "./tokenManager";
import apiEndpoints from './../apiEndpoints';
import Cookies from 'js-cookie';
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
    Cookies.set('UserId',response.data.id)
    setToken(response.data.token); 
    return response.data;
  } catch (error) {
    console.error("Login Error:", error.message);
    throw error; 
  }
};
