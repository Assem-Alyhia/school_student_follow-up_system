// src/api/Financial/Payments/getFinancialPayments.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getFinancialPayments = async (params = {}) => {
  try {
    const { page = 1, per_page = 10 } = params;
    const res = await axiosInstance.get(apiEndpoints.finGetPayments, {
      params: { page, per_page },
    });
    if (res.status !== 200) {
      throw new Error("فشل في جلب قائمة المدفوعات (مالي)");
    }
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب قائمة المدفوعات (مالي)"
    );
  }
};
