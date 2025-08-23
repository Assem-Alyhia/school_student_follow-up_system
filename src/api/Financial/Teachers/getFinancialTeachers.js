// src/api/Financial/Teachers/getFinancialTeachers.js
import axiosInstance from "../../axiosInstance";
import api from "../../apiEndpoints";

export const getFinancialTeachers = async (params = {}) => {
  try {
    const res = await axiosInstance.get(api.finGetTeachers, { params });
    if (res.status !== 200) throw new Error("فشل في جلب المعلّمين (مالي)");
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب المعلّمين (مالي)"
    );
  }
};
