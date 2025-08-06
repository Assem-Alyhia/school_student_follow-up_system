// updatePayment.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const updatePayment = async (id, data) => {
  try {
    const response = await axiosInstance.put(
      apiEndpoints.updatePayment(id),
      data
    );
    return response.data.data;
  } catch (error) {
    console.error("فشل في تعديل الدفعة:", error);
    throw new Error(
      error.response?.data?.message || "فشل في تعديل بيانات الدفعة"
    );
  }
};
