// src/api/Teacher/Students/getStudentsInClassroom.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getAdminStudentsInClassroom = async (classroomId) => {
  try {
    const url = apiEndpoints.getAdminStudentsInClassroom(classroomId);
    const res = await axiosInstance.get(url);
    if (res.status !== 200) throw new Error("فشل في جلب طلاب الشعبة");
    return Array.isArray(res.data?.data)
      ? res.data.data
      : Array.isArray(res.data)
        ? res.data
        : [];
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب طلاب الشعبة"
    );
  }
};
