// src/api/Financial/SchoolFees/getAllFinancialSchoolFees.js
import axiosInstance from "../../axiosInstance";
import api from "../../apiEndpoints";

export const getAllFinancialSchoolFees = async () => {
  try {
    const res = await axiosInstance.get(api.finGetAllSchoolFees);
    if (res.status !== 200)
      throw new Error("فشل في جلب جميع رسوم المدرسة (مالي)");
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب جميع رسوم المدرسة (مالي)"
    );
  }
};
