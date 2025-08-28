import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

// getSupervisorById.js
export const getSupervisorById = async (id) => {
  try {
    const response = await axiosInstance.get(
      apiEndpoints.getSupervisorById(id)
    );
    return response.data.data; // تأكد من هذه النقطة 👈
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "فشل في جلب بيانات المشرف"
    );
  }
};
