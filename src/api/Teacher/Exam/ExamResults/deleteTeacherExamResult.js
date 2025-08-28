// src/api/Teacher/ExamResults/deleteTeacherExamResult.js
import apiEndpoints from "../../../apiEndpoints";
import axiosInstance from "../../../axiosInstance";

export const deleteTeacherExamResult = async (examResultId) => {
  try {
    const res = await axiosInstance.delete(
      apiEndpoints.deleteTeacherExamResult(examResultId)
    );
    if (![200, 204].includes(res.status)) {
      throw new Error("فشل في حذف نتيجة الامتحان");
    }
    return res.data ?? { message: "تم الحذف بنجاح" };
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء حذف نتيجة الامتحان"
    );
  }
};
