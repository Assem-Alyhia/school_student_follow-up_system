// deletePayment.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const deletePayment = async (id) => {
  try {
    const response = await axiosInstance.delete(apiEndpoints.deletePayment(id));
    return response.data.data;
  } catch (error) {
    console.error("فشل في حذف الدفعة:", error);
    throw new Error(error.response?.data?.message || "فشل في حذف الدفعة");
  }
};
