import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";


export const deleteSupervisor = async (id) => {
  try {
    const response = await axiosInstance.delete(
      apiEndpoints.deleteSupervisor(id)
    );
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "فشل في حذف المشرف");
  }
};
