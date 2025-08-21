// src/api/Teacher/Exam/deleteTeacherExam.js
import axiosInstance from "../../../axiosInstance";
import apiEndpoints from "../../../apiEndpoints";

export const deleteTeacherExam = async (examId) => {
  try {
    const res = await axiosInstance.delete(
      apiEndpoints.deleteTeacherExam(examId)
    );
    if (![200, 204].includes(res.status))
      throw new Error("فشل في حذف الامتحان");
    return res.data ?? { message: "تم الحذف بنجاح" };
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء حذف الامتحان"
    );
  }
};
