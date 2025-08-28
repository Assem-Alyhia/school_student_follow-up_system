import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getTeacherGradeById = async (gradeId) => {
  try {
    const res = await axiosInstance.get(
      apiEndpoints.getTeacherGradeById(gradeId)
    );
    if (res.status !== 200) throw new Error("فشل في جلب بيانات الدرجة");
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب بيانات الدرجة"
    );
  }
};
