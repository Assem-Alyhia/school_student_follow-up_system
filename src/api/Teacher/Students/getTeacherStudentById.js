// api/Teacher/Students/getTeacherStudentById.js
import apiEndpoints from "../../apiEndpoints";
import axiosInstance from "../../axiosInstance";

export const getTeacherStudentById = async (studentId) => {
  try {
    const response = await axiosInstance.get(
      apiEndpoints.getTeacherStudentById(studentId)
    );

    if (response.status !== 200) {
      throw new Error("فشل في جلب تفاصيل الطالب");
    }

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "حدث خطأ أثناء جلب تفاصيل الطالب"
    );
  }
};
