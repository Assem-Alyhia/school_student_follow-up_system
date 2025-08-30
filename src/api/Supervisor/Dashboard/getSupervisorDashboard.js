// src/api/Supervisor/Dashboard/getSupervisorDashboard.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getSupervisorDashboard = async () => {
  try {
    const res = await axiosInstance.get(apiEndpoints.getSupervisorDashboard);

    if (res.status !== 200) {
      throw new Error("فشل في جلب بيانات لوحة تحكم المشرف");
    }
    return res.data?.data ?? res.data ?? {};
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب بيانات لوحة تحكم المشرف"
    );
  }
};
