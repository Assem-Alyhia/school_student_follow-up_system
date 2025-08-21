// src/api/Teacher/ExamResults/createTeacherExamResults.js
import apiEndpoints from "../../../apiEndpoints";
import axiosInstance from "../../../axiosInstance";

export const createTeacherExamResults = async (payload) => {
  try {
    const res = await axiosInstance.post(
      apiEndpoints.createTeacherExamResults,
      payload
    );
    if (![200, 201].includes(res.status)) {
      throw new Error("فشل في إنشاء نتائج الامتحان");
    }
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء إنشاء نتائج الامتحان"
    );
  }
};
