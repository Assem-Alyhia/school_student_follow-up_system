// src/api/Teacher/Classrooms/getAllTeacherClassrooms.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getAllTeacherClassrooms = async () => {
  try {
    const res = await axiosInstance.get(apiEndpoints.getAllTeacherClassrooms);

    if (res.status !== 200) {
      throw new Error("فشل في جلب صفوف المعلم");
    }

    return res.data?.data ?? res.data ?? [];
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب صفوف المعلم"
    );
  }
};
