// src/api/Teacher/Schedules/getTeacherSchedulesByClassroom.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getTeacherSchedulesByClassroom = async (classroomId) => {
  if (!classroomId) throw new Error("classroomId مطلوب");

  try {
    const url = `${apiEndpoints.getTeacherSchedulesByClassroom}/${classroomId}`;
    const res = await axiosInstance.get(url);

    if (res.status !== 200) {
      throw new Error("فشل في جلب الجداول/التقارير");
    }

    return res.data?.data ?? [];
  } catch (err) {
    throw new Error(
      err.response?.data?.message ||
        err.message ||
        "حدث خطأ أثناء جلب الجداول/التقارير"
    );
  }
};
