// src/api/Financial/Payments/updateFinancialPayment.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const updateFinancialPayment = async (paymentId, payload = {}) => {
  try {
    if (!paymentId) throw new Error("يجب تمرير معرّف المدفوع");
    const res = await axiosInstance.put(
      apiEndpoints.finUpdatePayment(paymentId),
      payload
    );
    if (res.status !== 200) throw new Error("فشل في تحديث المدفوع (مالي)");
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء تحديث المدفوع (مالي)"
    );
  }
};
