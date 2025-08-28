// getPaymentById.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getPaymentById = async (id) => {
  try {
    const response = await axiosInstance.get(apiEndpoints.getPaymentById(id));
    return response.data.data;
  } catch (error) {
    console.error("فشل في جلب بيانات الدفعة:", error);
    throw new Error(
      error.response?.data?.message || "فشل في تحميل بيانات الدفعة"
    );
  }
};
