// src/api/Parent/Grades/getParentGrades.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getParentGrades = async (page = 1, per_page = 10) => {
  try {
    const params = typeof page === "object" ? page : { page, per_page }; 

    const res = await axiosInstance.get(apiEndpoints.getParentGrades, {
      params,
    });
    if (res.status !== 200) {
      throw new Error("فشل في جلب الدرجات");
    }
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب الدرجات"
    );
  }
};
