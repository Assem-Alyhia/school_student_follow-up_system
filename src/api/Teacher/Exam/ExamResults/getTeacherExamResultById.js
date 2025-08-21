// src/api/Teacher/ExamResults/getTeacherExamResultById.js
import apiEndpoints from "../../../apiEndpoints";
import axiosInstance from "../../../axiosInstance";

export const getTeacherExamResultById = async (examResultId) => {
  try {
    const res = await axiosInstance.get(
      apiEndpoints.getTeacherExamResultById(examResultId)
    );
    if (res.status !== 200) throw new Error("فشل في جلب نتيجة الامتحان");
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب نتيجة الامتحان"
    );
  }
};
