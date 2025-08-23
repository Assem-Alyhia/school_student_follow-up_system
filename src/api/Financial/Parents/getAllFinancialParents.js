// src/api/Financial/Parents/getAllFinancialParents.js
import axiosInstance from "../../axiosInstance";
import api from "../../apiEndpoints";

/** جلب جميع أولياء الأمور بدون ترقيم */
export const getAllFinancialParents = async () => {
  try {
    const res = await axiosInstance.get(api.finGetAllParents);
    if (res.status !== 200)
      throw new Error("فشل في جلب جميع أولياء الأمور (مالي)");
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب جميع أولياء الأمور (مالي)"
    );
  }
};
