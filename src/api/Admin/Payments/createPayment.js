// createPayment.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const createPayment = async (data) => {
  try {
    const response = await axiosInstance.post(apiEndpoints.createPayment, data);
    return response.data.data;
  } catch (error) {
    console.error("فشل في إنشاء الدفعة:", error);
    throw new Error(error.response?.data?.message || "فشل في إضافة دفعة جديدة");
  }
};
