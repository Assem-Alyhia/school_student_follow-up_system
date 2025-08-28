// src/api/supervisors/getSupervisorLocation.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getSupervisorLocation = async (supervisorId) => {
  try {
    const response = await axiosInstance.get(
      apiEndpoints.getSupervisorLocation(supervisorId)
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || "فشل في جلب موقع المشرف"
    );
  }
};
