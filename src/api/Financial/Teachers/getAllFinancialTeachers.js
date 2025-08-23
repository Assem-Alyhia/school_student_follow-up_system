// src/api/Financial/Teachers/getAllFinancialTeachers.js
import axiosInstance from "../../axiosInstance";
import api from "../../apiEndpoints";

export const getAllFinancialTeachers = async () => {
  try {
    const res = await axiosInstance.get(api.finGetAllTeachers);
    if (res.status !== 200) throw new Error("فشل في جلب جميع المعلّمين (مالي)");
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب جميع المعلّمين (مالي)"
    );
  }
};
