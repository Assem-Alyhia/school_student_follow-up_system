// src/api/Financial/SchoolFees/getFinancialSchoolFees.js
import axiosInstance from "../../axiosInstance";
import api from "../../apiEndpoints";

export const getFinancialSchoolFees = async (params = {}) => {
  try {
    const res = await axiosInstance.get(api.finGetSchoolFees, { params });
    if (res.status !== 200) throw new Error("فشل في جلب رسوم المدرسة (مالي)");
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب رسوم المدرسة (مالي)"
    );
  }
};
