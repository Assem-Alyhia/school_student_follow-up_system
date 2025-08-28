// src/api/Teacher/Exams/getTeacherExamTypes.js
import apiEndpoints from "../../apiEndpoints";
import axiosInstance from "../../axiosInstance";

export const getTeacherExamTypes = async () => {
  try {
    const res = await axiosInstance.get(apiEndpoints.getTeacherExamTypes);
    if (res.status !== 200) throw new Error("فشل في جلب أنواع الاختبارات");
    return res.data?.data ?? res.data ?? []; 
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب أنواع الاختبارات"
    );
  }
};
