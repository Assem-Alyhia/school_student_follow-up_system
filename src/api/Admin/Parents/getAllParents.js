import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getAllParents = async () => {
  try {
    const response = await axiosInstance.get(apiEndpoints.getAllParents);
    return response.data.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "فشل في جلب أولياء الأمور"
    );
  }
};
