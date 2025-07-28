import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getAllSupervisors = async () => {
  try {
    const response = await axiosInstance.get(apiEndpoints.getAllSupervisors);
    return response.data.data;
  } catch (error) {
  throw new Error(error?.response?.data?.message || "فشل في جلب  المشرفين");
}

};
