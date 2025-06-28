import axiosInstance from "../axiosInstance";
import apiEndpoints from "../apiEndpoints";

export const forgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post(apiEndpoints.forgotPassword, {
      email,
    });
    if (response.data.status === "failed") {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || "Request failed"
    );
  }
};
