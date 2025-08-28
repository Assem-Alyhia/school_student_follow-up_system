// api/Teacher/Grades/grades.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const deleteTeacherGrade = async (gradeId) => {
  try {
    const res = await axiosInstance.delete(
      apiEndpoints.deleteTeacherGrade(gradeId)
    );
    if (![200, 204].includes(res.status)) throw new Error("فشل في حذف الدرجة");
    return res.data ?? { message: "تم الحذف بنجاح" };
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء حذف الدرجة"
    );
  }
};
