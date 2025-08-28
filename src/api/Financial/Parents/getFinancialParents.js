// src/api/Financial/Parents/getFinancialParents.js
import axiosInstance from "../../axiosInstance";
import api from "../../apiEndpoints";

export const getFinancialParents = async (params = {}) => {
  try {
    const res = await axiosInstance.get(api.finGetParents, { params });
    if (res.status !== 200) throw new Error("فشل في جلب أولياء الأمور (مالي)");
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب أولياء الأمور (مالي)"
    );
  }
};
