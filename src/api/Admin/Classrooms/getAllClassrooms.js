import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getAllClassrooms = async () => {
  try {
    const response = await axiosInstance.get(apiEndpoints.getAllClassrooms);
    return response.data.data;
  } catch (error) {
  throw new Error(error?.response?.data?.message || "فشل في جلب الصفوف ");
}

};
