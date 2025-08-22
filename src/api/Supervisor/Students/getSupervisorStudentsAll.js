// src/api/Supervisor/Students/getSupervisorStudentsAll.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getSupervisorStudentsAll = async () => {
  try {
    const res = await axiosInstance.get(
      apiEndpoints.getSupervisorStudentsNoPaginate
    );
    if (res.status !== 200) throw new Error("فشل في جلب جميع الطلاب (مشرف)");
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب جميع الطلاب (مشرف)"
    );
  }
};
