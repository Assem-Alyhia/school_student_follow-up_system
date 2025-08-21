// src/api/Teacher/Exam/getTeacherExamById.js
import axiosInstance from "../../../axiosInstance";
import apiEndpoints from "../../../apiEndpoints";

export const getTeacherExamById = async (examId) => {
  try {
    const res = await axiosInstance.get(
      apiEndpoints.getTeacherExamById(examId)
    );
    if (res.status !== 200) throw new Error("فشل في جلب بيانات الامتحان");
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب بيانات الامتحان"
    );
  }
};
