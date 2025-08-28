// src/api/Student/Exams/getStudentExamResults.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getStudentExamGrades = async (params = {}) => {
  try {
    const res = await axiosInstance.get(apiEndpoints.getStudentExamGrades, {
      params,
    });
    if (res.status !== 200) throw new Error("فشل في جلب النتائج الامتحانية");
    return res.data; 
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب النتائج الامتحانية"
    );
  }
};
