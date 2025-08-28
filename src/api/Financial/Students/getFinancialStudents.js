// src/api/Financial/Students/getFinancialStudents.js
import axiosInstance from "../../axiosInstance";
import api from "../../apiEndpoints";

export const getFinancialStudents = async (params = {}) => {
  try {
    const res = await axiosInstance.get(api.finGetStudents, { params });
    if (res.status !== 200) throw new Error("فشل في جلب الطلاب (مالي)");
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب الطلاب (مالي)"
    );
  }
};
