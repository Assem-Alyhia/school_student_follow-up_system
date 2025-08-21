// src/api/Teacher/ExamResults/updateTeacherExamResult.js
import apiEndpoints from "../../../apiEndpoints";
import axiosInstance from "../../../axiosInstance";

export const updateTeacherExamResult = async (examResultId, payload) => {
  try {
    const res = await axiosInstance.put(
      apiEndpoints.updateTeacherExamResult(examResultId),
      payload
    );
    if (res.status !== 200) throw new Error("فشل في تحديث نتيجة الامتحان");
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء تحديث نتيجة الامتحان"
    );
  }
};
