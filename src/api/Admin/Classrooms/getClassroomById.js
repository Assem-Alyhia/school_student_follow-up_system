import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getClassroomById = async (id) => {
  try {
    const response = await axiosInstance.get(apiEndpoints.getClassroomById(id));
    return response.data.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "فشل في جلب بيانات الصف");
  }
};
