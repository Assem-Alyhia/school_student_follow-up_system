// src/api/Teacher/Subjects/getTeacherSubjects.js
import apiEndpoints from "../../apiEndpoints";
import axiosInstance from "../../axiosInstance";

export const getTeacherSubjects = async (page = 1, perPage = 10) => {
  try {
    const url = `${apiEndpoints.getTeacherSubjects}?page=${page}&per_page=${perPage}`;
    const response = await axiosInstance.get(url);

    if (response.status !== 200) {
      throw new Error("فشل في جلب مواد المعلم");
    }

    return response.data; 
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "حدث خطأ أثناء جلب مواد المعلم"
    );
  }
};
