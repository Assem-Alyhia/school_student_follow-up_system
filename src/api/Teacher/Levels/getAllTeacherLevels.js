// src/api/Teacher/Levels/getAllTeacherLevels.js
import apiEndpoints from "../../apiEndpoints";
import axiosInstance from "../../axiosInstance";

export const getAllTeacherLevels = async (page = 1, perPage = 10) => {
  try {
    const url = `${apiEndpoints.getAllTeacherLevels}?page=${page}&per_page=${perPage}`;
    const res = await axiosInstance.get(url);
    if (res.status !== 200) throw new Error("فشل في جلب المراحل الدراسية");
    return res.data; 
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب المراحل الدراسية"
    );
  }
};
