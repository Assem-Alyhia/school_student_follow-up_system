// src/api/Financial/Payments/getAllFinancialPayments.js
import axiosInstance from "../../axiosInstance";
import api from "../../apiEndpoints";

export const getAllFinancialPayments = async () => {
  try {
    const res = await axiosInstance.get(api.finGetAllPayments);
    if (res.status !== 200) throw new Error("فشل في جلب جميع المدفوعات (مالي)");
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب جميع المدفوعات (مالي)"
    );
  }
};
