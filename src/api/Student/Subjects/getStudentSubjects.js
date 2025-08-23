// src/api/Student/Subjects/getStudentSubjects.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getStudentSubjects = async (params = {}) => {
  try {
    const res = await axiosInstance.get(apiEndpoints.getStudentSubjects, {
      params,
    });
    if (res.status !== 200) {
      throw new Error("فشل في جلب مواد الطالب");
    }
    return res.data; 
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب مواد الطالب"
    );
  }
};
