// src/api/Financial/Payments/createFinancialPayment.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";


export const createFinancialPayment = async (payload = {}) => {
  try {
    const res = await axiosInstance.post(apiEndpoints.finCreatePayment, payload);
    if (res.status !== 201 && res.status !== 200)
      throw new Error("فشل في إنشاء المدفوع (مالي)");
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء إنشاء المدفوع (مالي)"
    );
  }
};
