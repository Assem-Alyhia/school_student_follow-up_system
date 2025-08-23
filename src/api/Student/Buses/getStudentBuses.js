// src/api/Student/Buses/getStudentBuses.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";


export const getStudentBuses = async (params = {}) => {
  try {
    const res = await axiosInstance.get(apiEndpoints.getStudentBuses, {
      params,
    });
    if (res.status !== 200) throw new Error("فشل في جلب الباصات");
    return res.data; 
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب الباصات"
    );
  }
};
