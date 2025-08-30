// src/api/Parent/Dashboard/getParentDashboard.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getParentDashboard = async () => {
  try {
    const res = await axiosInstance.get(apiEndpoints.getParentDashboard);

    if (res.status !== 200) {
      throw new Error("فشل في جلب بيانات لوحة تحكم وليّ الأمر");
    }

    return res.data?.data ?? res.data ?? {};
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب بيانات لوحة تحكم وليّ الأمر"
    );
  }
};
