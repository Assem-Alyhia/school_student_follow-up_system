// src/api/Student/Classrooms/getStudentClassrooms.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";


export const getStudentClassrooms = async (params = {}) => {
  try {
    const res = await axiosInstance.get(apiEndpoints.getStudentClassrooms, {
      params,
    });
    if (res.status !== 200) {
      throw new Error("فشل في جلب صفوف الطالب");
    }
    return res.data; 
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب صفوف الطالب"
    );
  }
};
