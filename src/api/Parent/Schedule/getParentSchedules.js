// api/Parent/Schedule/getParentSchedules.js
import apiEndpoints from "../../apiEndpoints";
import axiosInstance from "../../axiosInstance";

export const getParentSchedules = async (params = {}) => {
  try {
    const res = await axiosInstance.get(apiEndpoints.getParentSchedules, {
      params,
    });
    if (res.status !== 200) throw new Error("فشل في جلب تقويم وليّ الأمر");
    return res.data; 
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "حدث خطأ أثناء جلب تقويم وليّ الأمر"
    );
  }
};
