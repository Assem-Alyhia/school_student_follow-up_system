// src/api/Teacher/Exam/createTeacherExam.js
import axiosInstance from "../../../axiosInstance";
import apiEndpoints from "../../../apiEndpoints";

export const createTeacherExam = async (payload) => {
  try {
    const res = await axiosInstance.post(
      apiEndpoints.createTeacherExam,
      payload
    );
    if (![200, 201].includes(res.status))
      throw new Error("فشل في إنشاء الامتحان");
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء إنشاء الامتحان"
    );
  }
};
