// src/api/Teacher/Grades/getTeacherGrades.js
import apiEndpoints from "../../apiEndpoints";
import axiosInstance from "../../axiosInstance";

export const getTeacherGrades = async (page = 1, perPage = 10) => {
  try {
    const url = `${apiEndpoints.getTeacherGrades}?page=${page}&per_page=${perPage}`;
    const response = await axiosInstance.get(url);

    if (response.status !== 200) {
      throw new Error("فشل في جلب الدرجات");
    }

    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب الدرجات"
    );
  }
};
