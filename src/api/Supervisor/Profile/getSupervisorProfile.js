// src/api/Supervisor/getSupervisorProfile.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getSupervisorProfile = async () => {
  try {
    const res = await axiosInstance.get(apiEndpoints.getSupervisorProfile);
    if (res.status !== 200) {
      throw new Error("فشل في جلب بروفايل المشرف");
    }
    return res.data; 
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب بروفايل المشرف"
    );
  }
};
