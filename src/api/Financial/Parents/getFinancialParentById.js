// src/api/Financial/Parents/getFinancialParentById.js
import axiosInstance from "../../axiosInstance";
import api from "../../apiEndpoints";

/** جلب وليّ أمر محدد بالمعرّف */
export const getFinancialParentById = async (parentId) => {
  try {
    const res = await axiosInstance.get(api.finGetParentById(parentId));
    if (res.status !== 200)
      throw new Error("فشل في جلب بيانات وليّ الأمر (مالي)");
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب بيانات وليّ الأمر (مالي)"
    );
  }
};
