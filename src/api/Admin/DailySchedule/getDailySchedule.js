// src/api/Admin/DailySchedule/getDailySchedule.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getDailySchedule = async (classroomId, year) => {
  try {
    const response = await axiosInstance.get(
      apiEndpoints.getDailySchedule(classroomId, year)
    );
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
