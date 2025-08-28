// src/api/Parent/Schedules/getParentSchedulesByClassroom.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getParentSchedulesByClassroom = async (
  classroomId,
  pageOrParams = 1,
  per_page = 10
) => {
  if (!classroomId && classroomId !== 0) {
    throw new Error("يرجى تمرير معرف الصف classroomId");
  }

  try {
    const params =
      typeof pageOrParams === "object"
        ? pageOrParams
        : { page: pageOrParams, per_page };

    const url = `${apiEndpoints.getParentSchedulesByClassroom}/${classroomId}`;
    const res = await axiosInstance.get(url, { params });

    if (res.status !== 200) {
      throw new Error("فشل في جلب جداول الحصص");
    }
    return res.data; 
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب جداول الحصص"
    );
  }
};
