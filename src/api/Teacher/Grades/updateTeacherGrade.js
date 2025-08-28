// api/Teacher/Grades/grades.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const updateTeacherGrade = async (gradeId, payload) => {
  try {
    const res = await axiosInstance.put(
      apiEndpoints.updateTeacherGrade(gradeId),
      payload
    );
    if (res.status !== 200) throw new Error("فشل في تحديث الدرجة");
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء تحديث الدرجة"
    );
  }
};
