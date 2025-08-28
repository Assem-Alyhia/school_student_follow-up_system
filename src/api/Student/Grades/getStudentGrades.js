// src/api/Student/Grades/getStudentGrades.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";


export const getStudentGrades = async (params = {}) => {
  try {
    const res = await axiosInstance.get(apiEndpoints.getStudentGrades, {
      params,
    });
    if (res.status !== 200) throw new Error("فشل في جلب الدرجات");
    return res.data; 
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب الدرجات"
    );
  }
};
