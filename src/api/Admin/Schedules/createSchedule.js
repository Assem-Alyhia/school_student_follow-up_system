import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

// إنشاء جدول
export const createSchedule = async (payload) => {
  try {
    const { data } = await axiosInstance.post(
      apiEndpoints.createSchedule, 
      payload
    );
    return data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "فشل في إنشاء الجدول");
  }
};
