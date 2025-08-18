// src/api/Teacher/Exams/getTeacherExams.js
import apiEndpoints from "../../apiEndpoints";
import axiosInstance from "../../axiosInstance";

export const getTeacherExamsList = async (page = 1, perPage = 10) => {
  try {
    const url = `${apiEndpoints.getTeacherExamsList}?page=${page}&per_page=${perPage}`;
    const response = await axiosInstance.get(url);

    if (response.status !== 200) {
      throw new Error("فشل في جلب الامتحانات");
    }

    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب الامتحانات"
    );
  }
};
