// src/api/Student/Schedules/getStudentSchedules.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";


export const getStudentSchedules = async (params = {}) => {
  try {
    const res = await axiosInstance.get(apiEndpoints.getStudentSchedules, {
      params,
    });
    if (res.status !== 200) {
      throw new Error("فشل في جلب جداول الطالب");
    }
    return res.data; 
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب جداول الطالب"
    );
  }
};
