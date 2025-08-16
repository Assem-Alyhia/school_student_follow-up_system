import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const updateSchedule = async (id, payload) => {
  try {
    const { data } = await axiosInstance.put(
      apiEndpoints.updateSchedule(id),
      payload
    );
    return data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "فشل في تعديل الجدول");
  }
};
