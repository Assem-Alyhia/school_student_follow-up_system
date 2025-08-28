// src/api/Teacher/Exam/updateTeacherExam.js
import axiosInstance from "../../../axiosInstance";
import apiEndpoints from "../../../apiEndpoints";

export const updateTeacherExam = async (examId, payload) => {
  try {
    const res = await axiosInstance.put(
      apiEndpoints.updateTeacherExam(examId),
      payload
    );
    if (res.status !== 200) throw new Error("فشل في تحديث الامتحان");
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء تحديث الامتحان"
    );
  }
};
