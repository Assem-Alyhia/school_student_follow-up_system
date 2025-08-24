// src/api/Financial/Payments/getFinancialPayments.js
import axiosInstance from "../../axiosInstance";
import api from "../../apiEndpoints";

export const getFinancialPayments = async (params = {}) => {
  try {
    const res = await axiosInstance.get(api.finGetPayments, { params });
    if (res.status !== 200) throw new Error("فشل في جلب المدفوعات (مالي)");
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب المدفوعات (مالي)"
    );
  }
};
