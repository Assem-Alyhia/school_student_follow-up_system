// src/api/Student/Exams/getStudentExams.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getStudentExams = async (params = {}) => {
  try {
    const res = await axiosInstance.get(apiEndpoints.getStudentExams, {
      params,
    });
    if (res.status !== 200) {
      throw new Error("فشل في جلب قائمة الامتحانات");
    }
    return res.data; 
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب قائمة الامتحانات"
    );
  }
};
