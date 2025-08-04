import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getEventsSchedule = async (classroomId, year) => {
  try {
    const response = await axiosInstance.get(
      apiEndpoints.getEventsSchedule(classroomId, year)
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "فشل في جلب جدول الفعاليات"
    );
  }
};
