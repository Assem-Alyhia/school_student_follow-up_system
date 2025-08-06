// src/api/buses/deleteBus.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const deleteBus = async (id) => {
  try {
    const response = await axiosInstance.delete(apiEndpoints.deleteBus(id));
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || "فشل في حذف الباص"
    );
  }
};
