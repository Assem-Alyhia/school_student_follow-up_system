// src/api/Financial/Students/getAllFinancialStudents.js
import axiosInstance from "../../axiosInstance";
import api from "../../apiEndpoints";

export const getAllFinancialStudents = async () => {
  try {
    const res = await axiosInstance.get(api.finGetAllStudents);
    if (res.status !== 200) throw new Error("فشل في جلب جميع الطلاب (مالي)");
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب جميع الطلاب (مالي)"
    );
  }
};
