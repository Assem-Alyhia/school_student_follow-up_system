// src/api/Financial/Payments/getFinancialPaymentById.js
import axiosInstance from "../../axiosInstance";
import api from "../../apiEndpoints";

export const getFinancialPaymentById = async (paymentId) => {
  try {
    if (!paymentId) throw new Error("يجب تمرير معرّف المدفوع");
    const res = await axiosInstance.get(api.finGetPaymentById(paymentId));
    if (res.status !== 200) throw new Error("فشل في جلب المدفوع (مالي)");
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب المدفوع (مالي)"
    );
  }
};
