// src/api/Student/Students/getStudents.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";


export const getStudents = async (params = {}) => {
  try {
    const res = await axiosInstance.get(apiEndpoints.getStudents, { params });
    if (res.status !== 200) {
      throw new Error("فشل في جلب قائمة الطلاب");
    }
    return res.data; 
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب قائمة الطلاب"
    );
  }
};
