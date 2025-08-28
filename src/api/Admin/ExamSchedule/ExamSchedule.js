import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getExamSchedule = async (classroomId, year) => {
  if (!classroomId || !year) {
    throw new Error("يجب تمرير معرف الصف والسنة");
  }

  try {
    const response = await axiosInstance.get(
      apiEndpoints.getExamSchedule(classroomId, year)
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "فشل في جلب جدول الامتحانات"
    );
  }
};
