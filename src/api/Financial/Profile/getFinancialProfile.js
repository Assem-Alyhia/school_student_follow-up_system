// src/api/Financial/Profile/getFinancialProfile.js
import axiosInstance from "../../axiosInstance";
import api from "../../apiEndpoints";

export const getFinancialProfile = async () => {
  try {
    const res = await axiosInstance.get(api.finGetProfile);
    if (res.status !== 200) throw new Error("فشل في جلب ملف المالية");
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب ملف المالية"
    );
  }
};
