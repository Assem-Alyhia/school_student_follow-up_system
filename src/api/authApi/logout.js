import axiosInstance from "../axiosInstance";
import apiEndpoints from "./../apiEndpoints";
import { clearToken, getToken } from "./tokenManager";

export const logout = async () => {
  try {
    const token = getToken(); 

    if (!token) {
      throw new Error("No token found, please log in again.");
    }

    const response = await axiosInstance.post(
      apiEndpoints.logout,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );

    console.log("Logout Response:", response.data);

    if (response.data.status === "failed") {
      throw new Error(response.data.message);
    }

    clearToken();
    console.log("User logged out successfully");

    return response.data;
  } catch (error) {
    console.error("Logout Error:", error.message);
    throw error;
  }
};
