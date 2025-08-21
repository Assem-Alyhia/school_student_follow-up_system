// src/api/Parent/Students/getParentStudents.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getParentStudents = async (page = 1, per_page = 10) => {
  try {
    const params = typeof page === "object" ? page : { page, per_page }; // مرن: يقبل كائن أو قيمتين
    const res = await axiosInstance.get(apiEndpoints.getParentStudents, {
      params,
    });
    if (res.status !== 200) throw new Error("فشل في جلب قائمة الطلاب");
    return res.data; 
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب قائمة الطلاب"
    );
  }
};
