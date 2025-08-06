// getAllPaymentsNoPaginate.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getAllPaymentsNoPaginate = async () => {
  try {
    const response = await axiosInstance.get(
      apiEndpoints.getAllPaymentsNoPaginate
    );
    return response.data.data; // حسب تنسيق Laravel Resource Collection
  } catch (error) {
    console.error("فشل في جلب جميع الدفعات بدون باجينيشن:", error);
    throw new Error(
      error.response?.data?.message || "فشل في تحميل الدفعات الكاملة"
    );
  }
};
